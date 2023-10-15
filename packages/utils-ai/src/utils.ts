export function splitTextIntoChunks(text: string, maxTokens: number): string[] {
  const chunks: string[] = []
  let currentChunk: string = ''

  // TODO: we need to avoit splitting inside of a code block
  const paragraphs = text.split('\n\n')

  for (const paragraph of paragraphs) {
    const nextChunkTokens = countTokens(currentChunk + paragraph) + 1 // +1 for the \n\n

    // if current chunk + paragraph is more than max tokens, then push current chunk and start a new chunk
    if (nextChunkTokens > maxTokens) {
      chunks.push(currentChunk)
      currentChunk = ''
    }

    currentChunk += `${paragraph}\n\n`
  }

  // push the last chunk into the chunks array
  if (currentChunk.length > 0)
    chunks.push(currentChunk)

  return chunks
}

export function joinChunks(chunks: string[]): string {
  return chunks.join('\n\n')
}

export function countTokens(text: string): number {
  return text.length / 4
}
