import React, { useEffect, useRef } from 'react'
import { default as MonacoEditor } from '@monaco-editor/react'

import { debounce } from 'lodash'

interface EditorProps {
  defaultCode: string
  onChange: (code: string) => void
}
export function Editor(props: EditorProps) {
  const { defaultCode, onChange } = props

  return (
    <MonacoEditor
      language="c"
      defaultValue={defaultCode}
      theme="vs-dark"
      wrapperClassName="h-full"
      onChange={(code) => onChange(code)}
    />
  )
}
