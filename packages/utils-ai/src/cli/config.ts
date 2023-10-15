import { readUser } from 'rc9'
import { defu } from 'defu'
import type { DeepPartial } from '../config'
import { defaultConfig } from '../config'
import type { Config } from '../types'
import type { RC } from './types'

export const configFilename = '.utils-ai.conf'

export function getUserConfig(): RC {
  return readUser<RC>(configFilename)
}

export function mergeConfig(config: DeepPartial<Config>): Config {
  const userConfig = getUserConfig()

  return defu(config, userConfig, defaultConfig) as Config
}
