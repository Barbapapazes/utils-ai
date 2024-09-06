import { BaseAI } from './base_ai.js'
import type { OpenAIConfiguration } from '../types/index.js'

export class OpenAI extends BaseAI<OpenAIConfiguration> {
  static name = 'OpenAI'

  protected endpoint = 'https://api.openai.com/v1/chat/completions'

  async ask(prompt: string, content: string): Promise<string> {
    const { endpoint = this.endpoint, model } = this.options

    return await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: prompt }, { role: 'user', content }],
      }),
    })
      .then(response => response.json() as any)
      .then(json => json.choices[0].message.content)
  }
}
