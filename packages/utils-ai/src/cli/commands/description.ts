import { readFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import { mustBeMarkdown } from '../file'
import { mergeConfig } from '../config'
import { getPrompt } from '../../prompts'
import type { Language } from '../../types'
import { descriptor } from '../../functions'

export default defineCommand({
  meta: {
    name: 'description',
    description: 'Generate a description from content of a file',
  },
  args: {
    filename: {
      type: 'positional',
      required: true,
      description: 'File to generate the description from',
    },
    // TODO: use enum https://github.com/unjs/citty/pull/83
    language: {
      type: 'string',
      required: false,
      description: 'Language of the file',
      default: 'en',
    },
    // TODO: make the 3 next arguments sharable between command since they are related to every command
    // TODO: use number
    maxTokens: {
      type: 'string',
      required: false,
      description: '',
    },
    // TODO: use number
    temperature: {
      type: 'string',
      required: false,
      description: '',
    },
    accessKey: {
      type: 'string',
      required: false,
      description: '',
    },
  },
  run: async ({ args }) => {
    mustBeMarkdown(args.filename)

    const config = mergeConfig({
      preferredLanguage: args.language as Language,
      ai: {
        accessKey: args.accessKey,
        // TODO: update when type number will be supported
        maxTokens: args.maxTokens ? Number(args.maxTokens) : undefined,
        temperature: args.temperature ? Number(args.temperature) : undefined,
      },
    })

    const file = readFileSync(args.filename, 'utf-8')

    const prompt = getPrompt('descriptor', config.preferredLanguage)

    const description = await descriptor(file, prompt.message, config)

    // TODO: copy description to clipboard

    // eslint-disable-next-line no-console
    console.log(description)
  },
})
