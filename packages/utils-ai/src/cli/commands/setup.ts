import { defineCommand } from 'citty'
import { updateUser } from 'rc9'
import { configFilename } from '../config'
import type { RC } from '../types'
import type { Language } from '../../types'

export default defineCommand({
  meta: {
    name: 'setup',
    description: 'Setup the CLI',
  },
  args: {
    accessKey: {
      type: 'string',
      required: false,
      description: 'API key',
    },
    // TODO: Update to enum
    preferredLanguage: {
      type: 'string',
      required: false,
      description: 'Preferred language',
    },
    // TODO: Update to number
    temperature: {
      type: 'string',
      required: false,
      description: 'Temperature',
    },
    // TODO: Update to number
    maxTokens: {
      type: 'string',
      required: false,
      description: 'Max tokens',
    },
  },
  run: ({ args }) => {
    if (args.accessKey)
      updateUser<RC>({ ai: { accessKey: args.accessKey } }, configFilename)

    if (args.preferredLanguage)
      updateUser<RC>({ preferredLanguage: args.preferredLanguage as Language }, configFilename)

    if (args.temperature)
      updateUser<RC>({ ai: { temperature: Number(args.temperature) } }, configFilename)

    if (args.maxTokens)
      updateUser<RC>({ ai: { maxTokens: Number(args.maxTokens) } }, configFilename)
  },
})
