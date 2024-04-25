import type { Tokenizer } from './tokenizer'

export interface Splitter {
  /**
   * Split the text into chunks
   * @param text Text to split
   * @param maxChunkSize Maximal size of the chunk
   */
  split(text: string, maxChunkSize: number): string[]
}

export class SimpleSplitter implements Splitter {
  constructor(
    private readonly tokenizer: Tokenizer,
  ) {}

  split(text: string, maxChunkSize: number): string[] {
    const chunks: string[] = []
    let currentChunk: string = ''

    const paragraphs = this.#splitByParagraphs(text)

    for (const paragraph of paragraphs) {
      const nextChunkSize = this.tokenizer.count(currentChunk + paragraph) + 1 // +1 for the `\n\n`

      /**
       * If the current chunk + paragraph is more than the max chunk size, then we push the current chunk and start a new chunk.
       */
      if (nextChunkSize > maxChunkSize) {
        chunks.push(currentChunk)
        currentChunk = ''
      }

      currentChunk += `${paragraph}\n\n`
    }

    /**
     * Push the last chunk into the chunks array.
     */
    if (currentChunk.length > 0)
      chunks.push(currentChunk)

    return chunks
  }

  /**
   * Split the text by paragraphs
   */
  #splitByParagraphs(text: string): string[] {
    return text.split('\n\n')
  }
}
