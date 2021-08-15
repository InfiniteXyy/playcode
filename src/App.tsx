import React, { useEffect, useRef, useState } from 'react'
import { Editor } from './components/editor'
import { Terminal } from './components/terminal'
import CoreWorker from './core/worker?worker'
import { HelloWorldCode } from './examples'

import clang from './assets/clang.wasm?url'
import lld from './assets/lld.wasm?url'
import memfs from './assets/memfs.wasm?url'
import sysroot from './assets/sysroot.tar?url'

const channel = new MessageChannel()
const localPort = channel.port1
// 远程端口，仅在 worker 中使用
const remotePort = channel.port2

export function App() {
  const codeRef = useRef(localStorage.getItem('code') || HelloWorldCode)

  const [isLiteMode, setLiteMode] = useState(true)

  useEffect(() => {
    console.log('will load', { clang, lld, memfs, sysroot })
    const worker = new CoreWorker()
    // 将 remotePort 发送给 worker，并将 remotePort 的所有权交给 worker
    worker.postMessage({ id: 'constructor', data: remotePort }, [remotePort])
  }, [])

  const submitCode = () => {
    localPort.postMessage({ id: 'compileLinkRun', data: codeRef.current })
  }

  const onChange = (code) => {
    codeRef.current = code
    localStorage.setItem('code', code)
  }

  return (
    <div className="flex h-full overflow-hidden bg-dark-800 shadow-sm">
      <div className="w-1/2 flex flex-col overflow-hidden">
        <div className="flex items-center">
          <button
            onClick={submitCode}
            className="bg-green-500 text-white py-1 px-3 text-sm font-medium rounded-sm m-2 self-end hover:bg-green-600 transition"
          >
            运行
          </button>

          <label className="text-white">
            <input
              type="checkbox"
              checked={isLiteMode}
              onChange={() => setLiteMode((i) => !i)}
            />
            <span className="text-sm pl-2">简洁模式</span>
          </label>
        </div>
        <Editor defaultCode={codeRef.current} onChange={onChange} />
      </div>
      <div className="w-1/2 h-full">
        <Terminal messagePort={localPort} isLiteMode={isLiteMode} />
      </div>
    </div>
  )
}
