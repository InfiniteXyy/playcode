import React, { useEffect, useRef } from 'react'
import { throttle } from 'lodash'
import { Terminal as Xterm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

interface TerminalProps {
  messagePort: MessagePort
}

export function Terminal(props: TerminalProps) {
  const { messagePort } = props

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fitAddon = new FitAddon()
    const xterm = new Xterm()
    xterm.loadAddon(fitAddon)

    xterm.open(containerRef.current)
    const resizeObserver = new ResizeObserver(throttle(() => fitAddon.fit(), 60))
    resizeObserver.observe(containerRef.current)

    const onMessage = (event) => {
      switch (event.data.id) {
        case 'write':
          xterm.writeln(event.data.data)
          break
      }
    }
    messagePort.addEventListener('message', onMessage)
    // 如果不调用 start，messagePort 的 eventListener 不会被调用
    messagePort.start()
    return () => {
      resizeObserver.disconnect()
      messagePort.removeEventListener('message', onMessage)
    }
  }, [])

  return <div className="h-full" ref={containerRef} />
}
