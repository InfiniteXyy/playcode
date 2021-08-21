const yellowArrow = '\x1b[1;93m>\x1b[0m '
const green = '\x1b[1;32m'
const normal = '\x1b[0m'

// override the default behaviour of pyodide
self.console.log = (text) => port.postMessage({ id: 'write', data: green + text + normal })

let port
let babelReadyPromise

async function loadBabel() {
  port.postMessage({
    id: 'write',
    data: yellowArrow + 'downloading babel...',
  })
  await import('https://cdn.jsdelivr.net/npm/@babel/standalone@7.15.3/babel.min.js')
}

async function onAnyMessage(event) {
  switch (event.data.id) {
    case 'constructor':
      port = event.data.data
      port.onmessage = onAnyMessage
      break

    case 'compileLinkRun':
      if (!babelReadyPromise) {
        babelReadyPromise = loadBabel()
      }
      await babelReadyPromise

      const { data } = event.data
      port.postMessage({ id: 'write', data: yellowArrow + 'run test.ts' })
      try {
        const fn = new Function(
          `(() => {${Babel.transform(data, { filename: 'test.ts', presets: ['env', 'typescript'] }).code}})()`
        )
        fn()
      } catch (error) {
        port.postMessage({ id: 'write', data: error.message })
      }
      break
  }
}

self.addEventListener('message', onAnyMessage)
