import { readFileSync, writeFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import type { Language, Message } from '../types'
import { getPrompt } from '../prompts'
import { fetchCompletion } from '../chat'
import { mustBeMarkdown } from './utils/filename'
import { getAccessKey } from './utils/config'

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
    mustBeMarkdown(args.filename)

    const file = readFileSync(args.filename, 'utf-8')

    const accessKey = getAccessKey()

    const prompt = getPrompt('spell-checker', args.language as Language)
    const messages: Message[] = [
      {
        role: 'system',
        content: prompt.message,
      },
      {
        role: 'user',
        content: file,
      },
    ]

    const response = await fetchCompletion(messages, { accessKey })

    const corrected = response.choices[0].message.content

    writeFileSync(args.filename, corrected, 'utf-8')
  },
})
