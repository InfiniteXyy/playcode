export enum Language {
  Cpp = 'cpp',
  Python = 'python',
  TypeScript = 'typescript',
}

export const LangaugeLabel: Record<Language, string> = {
  [Language.Cpp]: 'C++',
  [Language.Python]: 'Python',
  [Language.TypeScript]: 'TypeScript',
}


export const LangaugeExt: Record<Language, string> = {
  [Language.Cpp]: '.cpp',
  [Language.Python]: '.py',
  [Language.TypeScript]: '.ts',
}

