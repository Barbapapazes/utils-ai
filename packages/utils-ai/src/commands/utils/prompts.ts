import { prompts } from '../../prompts'
import type { Language, PromptName } from '../../types'

export function getPrompt(name: PromptName, language: Language) {
  return prompts[language][name]
}
