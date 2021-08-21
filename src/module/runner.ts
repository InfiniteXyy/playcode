import { defineModule } from 'zoov'
import { persist } from 'zustand/middleware'
import { HelloWorldCode } from '../examples'
import CoreWorker from '../core/worker?worker'

const channel = new MessageChannel()

export const localPort = channel.port1
/** only visible in worker */
export const remotePort = channel.port2

export enum Language {
  Cpp = 'cpp',
  Python = 'python',
}

export const runnerModule = defineModule({
  code: HelloWorldCode,
  language: Language.Cpp,
})
  .actions({
    setCode: (state, code: string) => (state.code = code),
    setLanguage: (state, lang: Language) => (state.language = lang),
  })
  .methods((self) => ({
    init() {
      const worker = new CoreWorker()
      worker.postMessage({ id: 'constructor', data: remotePort }, [remotePort])
    },
    runCode() {
      const { code, language } = self.getState()
      switch (language) {
        case Language.Cpp:
          localPort.postMessage({ id: 'compileLinkRun', data: code })
          break
        case Language.Python:
          alert('python not supported yet')
          break
      }
    },
  }))
  .middleware((store) => persist(store, { name: 'runner-store', version: 0 }))
  .build()
