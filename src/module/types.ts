export enum Language {
  Cpp = 'cpp',
  Python = 'python',
  TypeScript = 'typescript',
}

export const LanguageLabel: Record<Language, string> = {
  [Language.Cpp]: 'C++',
  [Language.Python]: 'Python',
  [Language.TypeScript]: 'TypeScript',
}


export const LanguageExt: Record<Language, string> = {
  [Language.Cpp]: '.cpp',
  [Language.Python]: '.py',
  [Language.TypeScript]: '.ts',
}

