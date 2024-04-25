import type { Config } from './types'

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T

export function defineUtilsAIConfig<T extends DeepPartial<Config> = DeepPartial<Config>>(config: T): T {
  return config
}

export const defaultConfig = defineUtilsAIConfig<Config>({
  preferredLanguage: 'en',
  ai: {
    accessKey: null,
    maxTokens: 2048,
    temperature: 0.7,
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
  },
})
