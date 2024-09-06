import { OpenAI } from './openai.js'
import type { BaseAIConfiguration } from '../types/index.js'
import type { BaseAI } from './base_ai.js'

export const ai: Record<string, typeof BaseAI<BaseAIConfiguration>> = {
  openai: OpenAI,
}
