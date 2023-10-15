export interface Config {
  preferredLanguage: Language
  ai: AI
}

export interface AI {
  accessKey: string | null
  maxTokens: number
  temperature: number
}

export type Language = 'fr' | 'en'

export type Prompts = Record<Language, Record<PromptName, Prompt>>

export type PromptName = 'spell-checker' | 'descriptor'

export interface Prompt {
  name: string
  message: string
}

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface Completion {
  id: string
  object: string
  created: number
  model: string
  choices: { index: number; message: Message; finish_reason: string }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
