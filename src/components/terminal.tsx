import React, { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { Terminal as Xterm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { localPort } from '../module/runner'

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [xterm] = useState(() => {
    return new Xterm()
  })

  useEffect(() => {
    xterm.open(containerRef.current)
    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)
    const resizeObserver = new ResizeObserver(
      debounce(() => fitAddon.fit(), 60)
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
          xterm.writeln(event.data.data)
          break
      }
    }
    localPort.addEventListener('message', onMessage)
    return () => {
      localPort.removeEventListener('message', onMessage)
    }
  }, [])

  return <div className="h-full" ref={containerRef} />
}
