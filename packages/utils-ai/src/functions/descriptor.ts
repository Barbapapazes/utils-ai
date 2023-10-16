import { defineMessages, fetchCompletion, getFirstSuggestion } from '../chat'
import { logger } from '../logger'
import type { Config } from '../types'

export interface DescriptorOptions extends Config {}

/**
 * Generate a description from a text using the prompt
 */
export async function descriptor(text: string, prompt: string, options: DescriptorOptions): Promise<string> {
  const messages = defineMessages([
    {
      role: 'system',
      content: prompt,
    },
    {
      role: 'user',
      content: text,
    },
  ])

  logger.debug(`Generating description`)
  const completion = await fetchCompletion(messages, { ...options.ai, maxTokens: null })
  logger.debug(`Generated description`)

  const description = getFirstSuggestion(completion)

  return description
}
