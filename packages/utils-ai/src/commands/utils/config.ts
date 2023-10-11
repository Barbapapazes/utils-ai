import { readUser } from 'rc9'
import type { RC } from '../../types'
import { configFilename } from '../../config'

export function getAccessKey(): string {
  const conf = readUser<RC>(configFilename)

  if (!conf.ai?.key)
    throw new Error('No API key found')

  return conf.ai.key
}
