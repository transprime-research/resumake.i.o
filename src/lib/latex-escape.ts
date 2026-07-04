const LATEX_REPLACEMENTS: Record<string, string> = {
  '\\': '\\textbackslash{}',
  '&': '\\&',
  '%': '\\%',
  '$': '\\$',
  '#': '\\#',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}'
}

const unicodeReplacements: Record<string, string> = {
  '\u00a0': ' ',
  '\u2013': '--',
  '\u2014': '---',
  '\u2018': "'",
  '\u2019': "'",
  '\u201c': '"',
  '\u201d': '"',
  '\u2026': '...'
}

export function escapeLatex(value: string) {
  return value
    .replace(
      /[\u00a0\u2013\u2014\u2018\u2019\u201c\u201d\u2026]/g,
      (char) => unicodeReplacements[char]
    )
    .replace(/[\\&%$#_{}~^]/g, (char) => LATEX_REPLACEMENTS[char])
}

export function sanitizeLatexInput<T>(value: T): T {
  if (typeof value === 'string') {
    return escapeLatex(value) as unknown as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeLatexInput(item)) as unknown as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        key === 'sections' || key === 'hiddenSections'
          ? item
          : sanitizeLatexInput(item)
      ])
    ) as T
  }

  return value
}
