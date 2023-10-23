import { readFileSync, writeFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import { mergeConfig } from '../config'
import { mustBeMarkdown } from '../file'
import { getPrompt } from '../../prompts'
import { correct } from '../../functions'
import type { Language } from '../../types'

export default defineCommand({
  meta: {
    name: 'correct',
    description: 'Correct content of a file',
  },
  args: {
    filename: {
      type: 'positional',
      required: true,
      description: 'File to correct',
    },
    // TODO: use number
    maxChunkSize: {
      type: 'string',
      required: false,
      description: '',
    },
    // TODO: use enum https://github.com/unjs/citty/pull/83
    language: {
      type: 'string',
      required: false,
      description: 'Language of the file',
    },
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

    const prompt = getPrompt('spell-checker-md', config.preferredLanguage)

    const correctedText = await correct(file, prompt.message, {
      ...config,
      maxChunkSize: args.maxChunkSize ? Number(args.maxChunkSize) : undefined,
    })

    writeFileSync(args.filename, correctedText, 'utf-8')
  },
})
