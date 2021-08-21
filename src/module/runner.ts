import create from 'zustand'
import { persist } from 'zustand/middleware'
import { DefaultPythonCode, DefaultCppCode, DefaultTypescriptCode } from '../examples'
import { Language } from './types'
import { initWorker } from './utils'

export const useRunner = create(
  persist<{
    language: Language
    codeMap: Record<Language, string>
    workerMap: { [key in Language]?: { worker: Worker; messagePort: MessagePort } }
    setCode: (code: string) => void
    setLanguage: (language: string) => void
    init: () => void
    runCode: () => void
  }>(
    (set, get) => ({
      workerMap: {},
      codeMap: {
        [Language.Cpp]: DefaultCppCode,
        [Language.Python]: DefaultPythonCode,
        [Language.TypeScript]: DefaultTypescriptCode,
      },
      language: Language.Cpp,
      setCode: (code: string) => {
        const state = get()
        const codeMap = { ...state.codeMap, [state.language]: code }
        set({ ...state, codeMap })
      },
      setLanguage: (language: Language) => set({ ...get(), language }),
      init() {
        set((state) => {
          for (const language of Object.values(Language)) {
            state.workerMap[language] = initWorker(language)
          }
        })
      },
      runCode() {
        const { codeMap, language, workerMap } = get()
        workerMap[language].messagePort.postMessage({ id: 'compileLinkRun', data: codeMap[language] })
      },
    }),
    { name: 'runner-store', version: 2, blacklist: ['workerMap'] }
  )
)

export const useMessagePort = () => {
  return useRunner((state) => state.workerMap[state.language]?.messagePort)
}
