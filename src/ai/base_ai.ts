import type { Awaitable, BaseAIConfiguration } from '../types/index.js'

export class BaseAI<T extends BaseAIConfiguration = BaseAIConfiguration> {
  static name: string

  protected key: string
  protected options: T

  constructor(key: string, options: T) {
    this.key = key
    this.options = options
  }

  ask(_prompt: string, _content: string): Awaitable<string> {
    throw new Error('Method not implemented.')
  }
}
