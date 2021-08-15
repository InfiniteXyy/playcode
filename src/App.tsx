import React, { useEffect, useRef } from 'react'
import { Editor } from './components/editor'
import { Terminal } from './components/terminal'
import CoreWorker from './core/worker?worker'
import { HelloWorldCode } from './examples'

const channel = new MessageChannel()
const localPort = channel.port1
// 远程端口，仅在 worker 中使用
const remotePort = channel.port2

export function App() {
  const codeRef = useRef(HelloWorldCode)
  useEffect(() => {
    const worker = new CoreWorker()
    // 将 remotePort 发送给 worker，并将 remotePort 的所有权交给 worker
    worker.postMessage({ id: 'constructor', data: remotePort }, [remotePort])
  }, [])

  const submitCode = () => {
    localPort.postMessage({ id: 'compileLinkRun', data: codeRef.current })
  }

  return (
    <div className="flex h-full overflow-hidden bg-dark-800 shadow-sm">
      <div className="w-1/2 flex flex-col overflow-hidden">
        <button
          onClick={submitCode}
          className="bg-green-500 text-white py-1 px-3 text-sm font-medium rounded-sm m-2 self-end hover:bg-green-600 transition"
        >
          运行
        </button>
        <Editor defaultCode={codeRef.current} onChange={(e) => (codeRef.current = e)} />
      </div>
      <div className="w-1/2 h-full">
        <Terminal messagePort={localPort} />
      </div>
    </div>
  )
}
