import { readFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import consola from 'consola'
import type { Language, Message } from '../types'
import { mustBeMarkdown } from './utils/filename'
import { getAccessKey } from './utils/config'
import { fetchCompletion } from './utils/chat'
import { getPrompt } from './utils/prompts'

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
  },
  run: async ({ args }) => {
    mustBeMarkdown(args.filename)

    const file = readFileSync(args.filename, 'utf-8')

    const accessKey = getAccessKey()

    const prompt = getPrompt('descriptor', args.language as Language)
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

    const description = response.choices[0].message.content
    // TODO: copy to clipboard
    consola.log(description)
  },
})
