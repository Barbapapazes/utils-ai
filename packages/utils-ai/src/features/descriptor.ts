import debug from '../debug'
import type { Fetcher } from '../fetcher'
import type { MessagesFactory } from '../message_factory'

export class DescriptorOptions {
  constructor(
  /**
   * The prompt to use for the description
   */
    public readonly prompt: string,
  ) {}
}

/**
 * Generate a description from a text using the prompt
 */
export class Descriptor {
  constructor(
    private readonly messagesFactory: MessagesFactory,
    private readonly fetcher: Fetcher,
    private readonly options: DescriptorOptions,
  ) {}

  async execute(text: string): Promise<string> {
    debug('Generating description')

    const description = await this.#generate(text)

    return description
  }

  async #generate(text: string): Promise<string> {
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
    const completion = await this.fetcher.completions(messages)

    return completion.choices[0].message.content
  }
}
