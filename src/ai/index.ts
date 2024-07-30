import type { BaseAIConfiguration } from '../types/index.js'
import type { BaseAI } from './base_ai.js'
import { OpenAI } from './openai.js'

export const ai: Record<string, typeof BaseAI<BaseAIConfiguration>> = {
  openai: OpenAI,
}
