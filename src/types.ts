export interface RC {
  ai?: {
    key?: string
  }
}

export type Language = 'fr' | 'en'

export type Prompts = Record<Language, Record<PromptName, Prompt>>

export type PromptName = 'spell-checker'

export interface Prompt {
  name: string
  message: string
}
