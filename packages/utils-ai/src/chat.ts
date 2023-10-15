import { ofetch } from 'ofetch'
import type { AI, Completion, Message } from './types'

export function defineMessages(message: Message[]): Message[] {
  return message
}

export async function fetchCompletion(messages: Message[], options: AI): Promise<Completion> {
  return ofetch<Completion>('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${options.accessKey}`,
    },
    body: {
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: options.maxTokens,
    },
  })
}

export function getFirstSuggestion(completion: Completion) {
  return completion.choices[0].message.content
}
