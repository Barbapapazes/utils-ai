import { readUser } from 'rc9'
import { defu } from 'defu'
import type { Config, DeepPartial, RC } from './types'

export const configFilename = '.utils-ai.conf'

export const defaultConfig: Config = {
  preferredLanguage: 'en',
  ai: {
    accessKey: '',
    maxTokens: 2048,
    temperature: 0.7,
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
  },
}

export function getUserConfig(): RC {
  return readUser<RC>(configFilename)
}

export function mergeConfig(config: DeepPartial<Config>): Config {
  const userConfig = getUserConfig()

  return defu(config, userConfig, defaultConfig) as Config
}
