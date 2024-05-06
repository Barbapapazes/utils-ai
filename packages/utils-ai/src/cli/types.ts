import type { Language } from '../prompter.js'
import type { AuthToken, Endpoint, Model } from '../types.js'

export interface Config {
  preferredLanguage: Language
  ai: AI
}

export interface AI {
  authToken: AuthToken
  endpoint: Endpoint
  model: Model
  /**
   * Context window of the model.
   */
  contextWindow: number
  /**
   * Maximum number of tokens that the model can generate.
   */
  outputTokens: number
  temperature: number

}

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T

export interface RC extends DeepPartial<Config> {}
