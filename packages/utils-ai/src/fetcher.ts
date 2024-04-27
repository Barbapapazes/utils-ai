import type { Message } from './message_factory.js'
import type { AuthToken, Endpoint, Model } from './types.js'

export interface Completion {
  id: string
  object: string
  created: number
  model: string
  choices: { index: number; message: Message; finish_reason: string }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface Fetcher {
  completions(messages: Message[]): Promise<Completion>
}

export class FetcherOptions {
  constructor(
    public authToken: AuthToken,
    public endpoint: Endpoint,
    public model: Model,
  ) {}
}

export class HttpFetcher implements Fetcher {
  constructor(private options: FetcherOptions) {}

  /**
   * Fetch a completion from the AI
   */
  async completions(messages: Message[]): Promise<Completion> {
    const response = await this.#fetch({ messages })

    if (!response.ok)
      throw new Error(`Fetch error: ${response.statusText}`)

    const json = await response.json() as Completion

    return json
  }

  #fetch(body: Record<string, unknown>) {
    return fetch(this.options.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.options.authToken}`,
      },
      body: JSON.stringify({
        model: this.options.model,
        ...body,
      }),
    })
  }
}
