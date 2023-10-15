import { defineMessages, fetchCompletion, getFirstSuggestion } from '../chat'
import { logger } from '../logger'
import type { Config } from '../types'
import { countTokens, joinChunks, splitTextIntoChunks } from '../utils'

export interface CorrectOptions extends Config {
  /**
   * Count in tokens
   */
  maxChunkSize?: number
}

/**
 * Corrects the text using the prompt
 * @param text The text to correct
 * @param prompt The prompt to use for the correction
 * @param options The options for the correction
 *
 * @returns The corrected text
 */
export async function correct(text: string, prompt: string, options: CorrectOptions): Promise<string> {
  const maxChunkSize = options.maxChunkSize ?? 1024
  const promptTokens = countTokens(prompt)

  // We remove the prompt size to avoid overflow
  const chunks = splitTextIntoChunks(text, maxChunkSize - promptTokens)

  logger.debug(`Correcting ${chunks.length} chunks`)
  const correctedChunks = await Promise.all(chunks.map(chunk => correctChunk(chunk, prompt, options)))
  logger.debug(`Corrected ${chunks.length} chunks`)

  return joinChunks(correctedChunks)
}

async function correctChunk(text: string, prompt: string, options: CorrectOptions): Promise<string> {
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

  const completion = await fetchCompletion(messages, options.ai)
  const suggestion = getFirstSuggestion(completion)

  return suggestion
}
