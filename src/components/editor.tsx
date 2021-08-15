import React, { Suspense } from 'react'

const MonacoEditor = React.lazy(() => import('@monaco-editor/react'))

interface EditorProps {
  defaultCode: string
  onChange: (code: string) => void
}
export function Editor(props: EditorProps) {
  const { defaultCode, onChange } = props

  return (
    <Suspense fallback={null}>
      <MonacoEditor
        language="c"
        defaultValue={defaultCode}
        theme="vs-dark"
        wrapperClassName="h-full"
        onChange={(code) => onChange(code)}
      />
    </Suspense>
  )
}
