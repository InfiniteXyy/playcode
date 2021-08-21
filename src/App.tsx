import React, { useEffect } from 'react'

import clang from './assets/clang.wasm?url'
import lld from './assets/lld.wasm?url'
import memfs from './assets/memfs.wasm?url'
import sysroot from './assets/sysroot.tar?url'

import Layout from './components/layout'
import Header from './components/header'
import Editor from './components/editor'
import Terminal from './components/terminal'

import { useRunner } from './module'

console.log({ clang, lld, memfs, sysroot })
export function App() {
  const { init } = useRunner(({ init }) => ({ init }))

  useEffect(() => {
    init()
  }, [])

  return <Layout header={<Header />} left={<Editor />} right={<Terminal />} />
}
