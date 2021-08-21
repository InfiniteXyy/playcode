import CppWorker from '../core/cpp/worker?worker'
import PyWorkerUrl from '../core/python/worker?url'
import TSWorkerUrl from '../core/typescript/worker?url'
import { Language } from './types'

export function initWorker(language: Language) {
  let worker: Worker
  if (language === Language.Cpp) {
    worker = new CppWorker()
  } else if (language === Language.Python) {
    worker = new Worker(PyWorkerUrl, { name: 'python-worker' })
  } else {
    worker = new Worker(TSWorkerUrl, { name: 'typescript-worker' })
  }
  const messageChannel = new MessageChannel()

  worker.postMessage({ id: 'constructor', data: messageChannel.port2 }, [messageChannel.port2])

  return { messagePort: messageChannel.port1, worker }
}
