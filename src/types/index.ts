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
}
