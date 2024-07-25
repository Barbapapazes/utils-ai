import type { Awaitable } from '../types/index.js'

export class BaseAI {
  protected key: string
  protected options: Record<string, unknown>

  constructor(key: string, options: Record<string, unknown> = {}) {
    this.key = key
    this.options = options
  }

  ask(_: string, __: string): Awaitable<string> {
    throw new Error('Method not implemented.')
  }
}
