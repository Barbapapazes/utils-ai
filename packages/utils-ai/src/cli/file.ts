export function isMarkdown(filename: string): boolean {
  return filename.endsWith('.md')
}

export function mustBeMarkdown(filename: string) {
  if (!isMarkdown(filename))
    throw new Error('Filename must finish by \'.md')
}
