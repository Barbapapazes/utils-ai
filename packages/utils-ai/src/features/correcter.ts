import debug from '../debug.js'
import type { Fetcher } from '../fetcher.js'
import type { MessagesFactory } from '../message_factory.js'
import type { Splitter } from '../splitter.js'
import type { Tokenizer } from '../tokenizer.js'

export class CorrecterOptions {
  constructor(
    /**
     * The prompt to use for the correction
     */
    public readonly prompt: string,
    /**
     * Count in tokens
     */
    public readonly maxChunkSize: number,
  ) {}
}

/**
 * Corrects the text using the prompt by sending them to the AI.
 */
export class Correcter {
  constructor(
    private readonly messagesFactory: MessagesFactory,
    private readonly tokenizer: Tokenizer,
    private readonly splitter: Splitter,
    private readonly fetcher: Fetcher,
    private readonly options: CorrecterOptions,
  ) {}

  async execute(text: string) {
    debug('Correcting text')

    const promptTokens = this.tokenizer.count(this.options.prompt)

    /**
     * We remove the prompt size to avoid overflow
     */
    const chunks = this.splitter.split(text, this.options.maxChunkSize - promptTokens)

    const correctedChunks = await Promise.all(chunks.map(chunk => this.#correct(chunk)))

    return correctedChunks.join('\n\n')
  }

  async #correct(text: string): Promise<string> {
    const messages = this.messagesFactory.define([
      {
        role: 'system',
        content: this.options.prompt,
      },
      {
        role: 'user',
        content: text,
      },
    ])

    debug('Fetching completions')
    const completions = await this.fetcher.completions(messages)

    return completions.choices[0].message.content
  }
}
