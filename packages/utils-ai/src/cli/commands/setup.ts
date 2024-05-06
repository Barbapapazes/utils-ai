import { defineCommand } from 'citty'
import { updateUser } from 'rc9'
import { configFilename } from '../config.js'
import type { RC } from '../types.js'
import type { Language } from '../../prompter.js'

export default defineCommand({
  meta: {
    name: 'setup',
    description: 'Setup the CLI',
  },
  args: {
    authToken: {
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
    // TODO: Update to number
    contextWindow: {
      type: 'string',
      required: false,
      description: '',
    },
    // TODO: Update to number
    outputTokens: {
      type: 'string',
      required: false,
      description: '',
    },
    // TODO: Update to number
    temperature: {
      type: 'string',
      required: false,
      description: '',
    },
  },
  run: ({ args }) => {
    if (args.authTokenq)
      updateUser<RC>({ ai: { authToken: args.authToken } }, configFilename)

    if (args.preferredLanguage)
      updateUser<RC>({ preferredLanguage: args.preferredLanguage as Language }, configFilename)

    if (args.endpoint)
      updateUser<RC>({ ai: { endpoint: args.endpoint } }, configFilename)

    if (args.model)
      updateUser<RC>({ ai: { model: args.model } }, configFilename)

    if (args.contextWindow)
      updateUser<RC>({ ai: { contextWindow: Number(args.maxTokens) } }, configFilename)

    if (args.outputTokens)
      updateUser<RC>({ ai: { outputTokens: Number(args.outputTokens) } }, configFilename)

    if (args.temperature)
      updateUser<RC>({ ai: { temperature: Number(args.temperature) } }, configFilename)
  },
})
