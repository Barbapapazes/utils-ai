import { readUser } from 'rc9'
import { defu } from 'defu'
import type { AuthToken, Endpoint, Model } from '../types.js'
import type { Config, DeepPartial, RC } from './types.js'

export const configFilename = '.utils-ai.conf'

export const defaultConfig: Config = {
  preferredLanguage: 'en',
  ai: {
    authToken: '' as AuthToken,
    endpoint: 'https://api.openai.com/v1/chat/completions' as Endpoint,
    model: 'gpt-3.5-turbo' as Model,
    contextWindow: 16_385,
    outputTokens: 4_096,
    temperature: 0.7,
  },
}

export function getUserConfig(): RC {
  return readUser<RC>(configFilename)
}

export function mergeConfig(config: DeepPartial<Config>): Config {
  const userConfig = getUserConfig()

  return defu(config, userConfig, defaultConfig) as Config
}
