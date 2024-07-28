export type Awaitable<T> = T | Promise<T>

export interface Prompt {
  name: string
  content: string
}

export interface AI {
  name: string
  keyName: string
  type: string
  model: string
}

export interface Action {
  name: string
  ai: AI['name']
  prompt: Prompt['name']
  target: 'inplace' | 'newfile'
  git?: {
    commitMessageBeforeAction?: '__ask__' | (string & {})
    commitMessageAfterAction?: '__ask__' | (string & {})
  }
}

export interface QuickAction {
  action: Action['name']
  fileTypes: string[]
}
