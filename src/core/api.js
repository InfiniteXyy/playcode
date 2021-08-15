import { App } from './app'
import { MemFS } from './memfs'
import { msToSec } from './shared'
import { Tar } from './tar'

import clangFactory from '../assets/clang.wasm'
import lldFactory from '../assets/lld.wasm'
import sysrootUrl from '../assets/sysroot.tar?url'

export class API {
  constructor(options) {
    this.hostWrite = options.hostWrite
    this.showTiming = options.showTiming || false

    this.clangCommonArgs = [
      '-disable-free',
      '-isysroot',
      '/',
      '-internal-isystem',
      '/include/c++/v1',
      '-internal-isystem',
      '/include',
      '-internal-isystem',
      '/lib/clang/8.0.1/include',
      '-ferror-limit',
      '19',
      '-fmessage-length',
      '80',
      '-fcolor-diagnostics',
    ]

    this.memfs = new MemFS({
      hostWrite: this.hostWrite,
    })
    this.ready = this.memfs.ready.then(() => {
      return this.untar(this.memfs, sysrootUrl)
    })
  }

  hostLog(message) {
    const yellowArrow = '\x1b[1;93m>\x1b[0m '
    this.hostWrite(`${yellowArrow}${message}`)
  }

  async hostLogAsync(message, promise) {
    const start = +new Date()
    this.hostLog(`${message}...`)
    const result = await promise
    const end = +new Date()
    this.hostWrite(' done.')
    if (this.showTiming) {
      const green = '\x1b[92m'
      const normal = '\x1b[0m'
      this.hostWrite(` ${green}(${msToSec(start, end)}s)${normal}\n`)
    }
    this.hostWrite('\n')
    return result
  }

  async untar(memfs, url) {
    await this.memfs.ready
    const promise = (async () => {
      const tar = new Tar(await fetch(url).then((result) => result.arrayBuffer()))
      tar.untar(this.memfs)
    })()
    await this.hostLogAsync(`Untarring ${url}`, promise)
  }

  async compile(options) {
    const input = options.input
    const contents = options.contents
    const obj = options.obj
    const opt = options.opt || '2'

    await this.ready
    this.memfs.addFile(input, contents)
    return await this.run(
      clangFactory,
      'clang',
      '-cc1',
      '-emit-obj',
      ...this.clangCommonArgs,
      '-O2',
      '-o',
      obj,
      '-x',
      'c++',
      input
    )
  }

  async compileToAssembly(options) {
    const input = options.input
    const output = options.output
    const contents = options.contents
    const obj = options.obj
    const triple = options.triple || 'x86_64'
    const opt = options.opt || '2'

    await this.ready
    this.memfs.addFile(input, contents)
    const clang = await this.getModule(this.clangFilename)
    await this.run(
      clang,
      'clang',
      '-cc1',
      '-S',
      ...this.clangCommonArgs,
      `-triple=${triple}`,
      '-mllvm',
      '--x86-asm-syntax=intel',
      `-O${opt}`,
      '-o',
      output,
      '-x',
      'c++',
      input
    )
    return this.memfs.getFileContents(output)
  }

  async link(obj, wasm) {
    const stackSize = 1024 * 1024

    const libdir = 'lib/wasm32-wasi'
    const crt1 = `${libdir}/crt1.o`

    await this.ready
    return await this.run(
      lldFactory,
      'wasm-ld',
      '--no-threads',
      '--export-dynamic', // TODO required?
      '-z',
      `stack-size=${stackSize}`,
      `-L${libdir}`,
      crt1,
      obj,
      '-lc',
      '-lc++',
      '-lc++abi',
      '-o',
      wasm
    )
  }

  async run(moduleFactory, ...args) {
    this.hostLog(`${args.join(' ')}\n`)
    const start = +new Date()
    const app = new App(moduleFactory, this.memfs, ...args)
    const instantiate = +new Date()
    const stillRunning = await app.run()
    const end = +new Date()
    this.hostWrite('\n')
    if (this.showTiming) {
      const green = '\x1b[92m'
      const normal = '\x1b[0m'
      let msg = `${green}(${msToSec(start, instantiate)}s`
      msg += `/${msToSec(instantiate, end)}s)${normal}\n`
      this.hostWrite(msg)
    }
    return stillRunning ? app : null
  }

  async compileLinkRun(contents) {
    const input = `test.cc`
    const obj = `test.o`
    const wasm = `test.wasm`
    await this.compile({ input, contents, obj })
    await this.link(obj, wasm)

    const buffer = this.memfs.getFileContents(wasm)
    return await this.run(async (inputObject) => {
      const testMod = await WebAssembly.compile(buffer)
      const testApp = await WebAssembly.instantiate(testMod, inputObject)
      await this.hostLogAsync(`Compiling ${wasm}`, testMod)
      return testApp.exports
    }, wasm)
  }
}
