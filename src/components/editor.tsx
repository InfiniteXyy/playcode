import React, { Suspense, useMemo } from 'react'
import { Language, runnerModule } from '../module/runner'
import LanguageSelector from './langauge-selector'

const MonacoEditor = React.lazy(() => import('@monaco-editor/react'))

export default function Editor() {
  const [{ code: defaultCode, language }, { setCode }] = runnerModule.use()

  const editor = useMemo(
    () => (
      <Suspense fallback={null}>
        <MonacoEditor
          language={language}
          options={{ fontSize: 17, minimap: { enabled: false } }}
          defaultValue={defaultCode}
          wrapperClassName="h-full"
          onChange={(code) => setCode(code)}
        />
      </Suspense>
    ),
    [language]
  )
  return (
    <div className="h-full flex flex-col">
      <div className="h-[50px] flex items-center justify-between px-4">
        <span className="font-medium text-sm text-gray-700">
          {language === Language.Cpp ? 'test.cpp' : 'test.py'}
        </span>
        <LanguageSelector />
      </div>
      {editor}
    </div>
  )
}
