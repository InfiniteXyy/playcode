import React, { useMemo } from 'react'
import { LangaugeExt, Language, runnerModule } from '../module'
import LanguageSelector from './langauge-selector'
import MonacoEditor from '@monaco-editor/react'
import { IoPlay } from 'react-icons/io5'

export default function Editor() {
  const [{ code: codeMap, language }, { setCode, runCode }] = runnerModule.use()

  return (
    <div className="h-full flex flex-col">
      <div className="h-[50px] flex items-center justify-between px-4">
        <span className="font-medium text-sm text-gray-700">{`test${LangaugeExt[language]}`}</span>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button className="focus:outline-transparent leading-none">
            <IoPlay onClick={runCode} className="text-green-500 h-5 w-5" />
          </button>
        </div>
      </div>
      <MonacoEditor
        value={codeMap[language]}
        language={language}
        options={{ fontSize: 17, minimap: { enabled: false }, wordWrap: 'on' }}
        wrapperClassName="h-full"
        onChange={(code) => setCode(code)}
      />
    </div>
  )
}
