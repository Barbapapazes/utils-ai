import type { Language } from '../prompter'

export interface Config {
  preferredLanguage: Language
  ai: AI
}

export interface AI {
  accessKey: string
  maxTokens: number
  temperature: number
  endpoint: string
  model: string

}

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T

export interface RC extends DeepPartial<Config> {}
