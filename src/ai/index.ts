import type { BaseAI } from './base_ai.js'
import { OpenAI } from './openai.js'

export const ai: Record<string, typeof BaseAI> = {
  openai: OpenAI,
}
