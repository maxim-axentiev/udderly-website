export type LegalBlock =
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; lines: string[] }

export type ParsedLegalText = {
  title: string
  blocks: LegalBlock[]
}

export function parseLegalText(text: string): ParsedLegalText {
  const lines = text.split('\n')
  const title = lines[0]?.replace(/^# /, '').trim() || 'Farm Policy'
  const blocks = lines
    .slice(1)
    .join('\n')
    .trim()
    .split(/\n\s*\n/)
    .flatMap((block): LegalBlock[] => {
      if (block.startsWith('### ')) {
        return [{ type: 'heading', text: block.replace(/^### /, '').trim() }]
      }
      if (block.startsWith('- ')) {
        return [
          {
            type: 'list',
            items: block.split('\n').map((line) => line.replace(/^- /, '').trim()),
          },
        ]
      }
      const paragraph = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
      return paragraph.length > 0 ? [{ type: 'paragraph', lines: paragraph }] : []
    })

  return { title, blocks }
}
