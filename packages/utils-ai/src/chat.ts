import { ofetch } from 'ofetch'
import type { Completion, Message } from './types'

export async function fetchCompletion(messages: Message[], options: { accessKey: string }): Promise<Completion> {
  return ofetch<Completion>('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${options.accessKey}`,
    },
    body: {
      model: 'gpt-3.5-turbo',
      messages,
    },
  })
}

export function getFirstSuggestion(completion: Completion) {
  return completion.choices[0].message.content
}
