import React, { useEffect, useRef, useState } from 'react'
import { throttle } from 'lodash'
import { Terminal as Xterm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

interface TerminalProps {
  messagePort: MessagePort
  isLiteMode: boolean
}

export function Terminal(props: TerminalProps) {
  const { messagePort, isLiteMode } = props

  const containerRef = useRef<HTMLDivElement | null>(null)

  const [xterm] = useState(() => {
    return new Xterm()
  })

  useEffect(() => {
    xterm.open(containerRef.current)
    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)
    const resizeObserver = new ResizeObserver(
      throttle(() => fitAddon.fit(), 60)
    )
    resizeObserver.observe(containerRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const onMessage = (event) => {
      switch (event.data.id) {
        case 'write':
          if (isLiteMode) {
            const data: string = event.data.data
            if (
              data.includes('wasm-ld') ||
              data.includes('clang -cc1') ||
              data.trim().length === 0
            )
              break
          }
          xterm.writeln(event.data.data)
          break
      }
    }
    // 如果不调用 start，messagePort 的 eventListener 不会被调用
    messagePort.start()
    messagePort.addEventListener('message', onMessage)
    return () => {
      messagePort.removeEventListener('message', onMessage)
    }
  }, [isLiteMode])

  return <div className="h-full" ref={containerRef} />
}
