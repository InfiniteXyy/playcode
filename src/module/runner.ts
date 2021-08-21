import { defineModule } from 'zoov'
import { persist } from 'zustand/middleware'
import { DefaultPythonCode, DefaultCppCode, DefaultTypescriptCode } from '../examples'
import { Language } from './types'
import { initWorker } from './utils'

export const runnerModule = defineModule<{
  language: Language
  code: Record<Language, string>
  workerMap: { [key in Language]?: { worker: Worker; messagePort: MessagePort } }
}>({
  code: {
    [Language.Cpp]: DefaultCppCode,
    [Language.Python]: DefaultPythonCode,
    [Language.TypeScript]: DefaultTypescriptCode,
  },
  language: Language.Cpp,
  workerMap: {},
})
  .actions({
    setCode: (state, code: string) => (state.code[state.language] = code),
    setLanguage: (state, lang: Language) => (state.language = lang),
    init: (state) => {
      for (const language of Object.values(Language)) {
        state.workerMap[language] = initWorker(language)
      }
    },
  })
  .methods((self) => ({
    runCode() {
      const { code, language, workerMap } = self.getState()
      workerMap[language].messagePort.postMessage({ id: 'compileLinkRun', data: code[language] })
    },
  }))
  .computed({
    messagePort: (state) => state.workerMap[state.language]?.messagePort,
  })
  .middleware((store) => persist(store, { name: 'runner-store', version: 2, blacklist: ['workerMap'] }))
  .build()
