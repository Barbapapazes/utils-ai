import { readFileSync, writeFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import { readUser } from 'rc9'
import { ofetch } from 'ofetch'
import { configFilename } from '../config'
import type { Language, RC } from '../types'
import { getPrompt } from './utils/prompts'

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
    // TODO: use enum https://github.com/unjs/citty/pull/83
    language: {
      type: 'string',
      required: false,
      description: 'Language of the file',
      default: 'en',
    },
  },
  run: async ({ args }) => {
    if (!args.filename.endsWith('.md'))
      throw new Error('File must be a markdown file')

    const file = readFileSync(args.filename, 'utf-8')

    const conf = readUser<RC>(configFilename)

    if (!conf.ai?.key)
      throw new Error('No API key found. Please run `utils-ai setup --key <key>`')

    const prompt = getPrompt('spell-checker', args.language as Language)

    const response = await ofetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${conf.ai.key}`,
      },
      body: {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt.message,
          },
          {
            role: 'user',
            content: file,
          },
        ],
      },
      retry: 0,
    })

    const corrected = response.choices[0].message.content

    writeFileSync(args.filename, corrected, 'utf-8')
  },
})
