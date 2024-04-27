import { readFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import { mustBeMarkdown } from '../file.js'
import { mergeConfig } from '../config.js'
import { SimpleMessagesFactory } from '../../message_factory.js'
import { FetcherOptions, HttpFetcher } from '../../fetcher.js'
import { Descriptor, DescriptorOptions } from '../../features/descriptor.js'
import type { Language } from '../../prompter.js'
import { Prompter, PrompterOptions } from '../../prompter.js'

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
    authToken: {
      type: 'string',
      required: false,
      description: '',
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
  run: async ({ args }) => {
    mustBeMarkdown(args.filename)

    const config = mergeConfig({
      preferredLanguage: args.language as Language,
      ai: {
        authToken: args.authToken,
        endpoint: args.endpoint,
        model: args.model,
        contextWindow: toNumber(args.contextWindow),
        outputTokens: toNumber(args.outputTokens),
        temperature: toNumber(args.temperature),
      },
    })

    const file = readFileSync(args.filename, 'utf-8')

    const prompterOptions = new PrompterOptions(
      config.preferredLanguage,
    )
    const prompter = new Prompter(prompterOptions)
    const prompt = prompter.find('descriptor')

    const messagesFactory = new SimpleMessagesFactory()

    const fetcherOptions = new FetcherOptions(
      config.ai.authToken,
      config.ai.endpoint,
      config.ai.model,
    )
    const fetcher = new HttpFetcher(fetcherOptions)

    const descriptorOptions = new DescriptorOptions(
      prompt.message,
    )
    const descriptor = new Descriptor(messagesFactory, fetcher, descriptorOptions)

    const description = await descriptor.execute(file)

    // TODO: copy description to clipboard

    // eslint-disable-next-line no-console
    console.log(description)
  },
})

function toNumber(value: string | undefined): number | undefined {
  return value ? Number(value) : undefined
}
