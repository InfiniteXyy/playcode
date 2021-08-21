import React, { useEffect, useRef, useState } from 'react'
import { Terminal as Xterm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { useMessagePort } from '../module/runner'

function debounce(fn: () => void, delay = 60) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const messagePort = useMessagePort()

  const [xterm] = useState(() => {
    return new Xterm()
  })

  useEffect(() => {
    xterm.open(containerRef.current)
    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)
    const resizeObserver = new ResizeObserver(debounce(() => fitAddon.fit()))
    resizeObserver.observe(containerRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!messagePort) return
    xterm.clear()
    const onMessage = (event) => {
      switch (event.data.id) {
        case 'write':
          xterm.writeln(event.data.data)
          break
      }
    }
    messagePort.onmessage = onMessage
  }, [messagePort])

  return <div className="h-full bg-black" ref={containerRef} />
}
