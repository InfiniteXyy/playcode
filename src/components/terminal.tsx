import React, { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { Terminal as Xterm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { runnerModule } from '../module/runner'

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { messagePort } = runnerModule.useComputed()

  const [xterm] = useState(() => {
    return new Xterm({ fontFamily: 'Sarasa Mono, Menlo' })
  })

  useEffect(() => {
    xterm.open(containerRef.current)
    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)
    const resizeObserver = new ResizeObserver(debounce(() => fitAddon.fit(), 60))
    resizeObserver.observe(containerRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!messagePort) return
    const onMessage = (event) => {
      switch (event.data.id) {
        case 'write':
          xterm.writeln(event.data.data)
          break
      }
    }
    messagePort.onmessage = onMessage
  }, [messagePort])

  return <div className="h-full" ref={containerRef} />
}
