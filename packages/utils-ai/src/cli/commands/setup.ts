import { defineCommand } from 'citty'
import { updateUser } from 'rc9'
import { configFilename } from '../config'
import type { RC } from '../types'
import type { Language } from '../../prompter'

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
    endpoint: {
      type: 'string',
      required: false,
      description: '',
    },
    model: {
      type: 'string',
      required: false,
      description: '',
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

    if (args.endpoint)
      updateUser<RC>({ ai: { endpoint: args.endpoint } }, configFilename)

    if (args.model)
      updateUser<RC>({ ai: { model: args.model } }, configFilename)
  },
})
