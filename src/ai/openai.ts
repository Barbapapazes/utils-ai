import { BaseAI } from './base_ai.js'

export class OpenAI extends BaseAI {
  constructor(key: string, options: Record<string, unknown> = {}) {
    super(key, options)
  }

  async ask(prompt: string, content: string): Promise<string> {
    return await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.key}`,
      },
      body: JSON.stringify({
        model: this.options.model,
        messages: [{ role: 'system', content: prompt }, { role: 'user', content }],
      }),
    })
      .then(response => response.json() as any)
      .then(json => json.choices[0].message.content)
  }
}
