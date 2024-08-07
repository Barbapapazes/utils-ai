export type Awaitable<T> = T | Promise<T>

export type BaseAIConfiguration = Record<string, any>

export interface OpenAIConfiguration {
  model: string
  endpoint?: string
}

export interface Prompt {
  name: string
  content: string
}

export interface AI {
  name: string
  keyName: string
  provider: 'openai'
  configuration: OpenAIConfiguration
}

export interface Action {
  name: string
  ai: AI['name']
  prompt: Prompt['name']
  target: 'replace' | 'append' | 'prepend' | 'newfile'
  git?: {
    commitMessageBeforeAction?: '__ask__' | (string & {})
    commitMessageAfterAction?: '__ask__' | (string & {})
  }
}

export interface QuickAction {
  action: Action['name']
  fileTypes: string[]
}
