import { readFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import { mustBeMarkdown } from '../file'
import { mergeConfig } from '../config'
import { SimpleMessagesFactory } from '../../message_factory'
import { FetcherOptions, HttpFetcher } from '../../fetcher'
import { Descriptor, DescriptorOptions } from '../../features'
import type { Language } from '../../prompter'
import { Prompter, PrompterOptions } from '../../prompter'

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
  run: async ({ args }) => {
    mustBeMarkdown(args.filename)

    const config = mergeConfig({
      preferredLanguage: args.language as Language,
      ai: {
        accessKey: args.accessKey,
        // TODO: update when type number will be supported
        maxTokens: args.maxTokens ? Number(args.maxTokens) : undefined,
        temperature: args.temperature ? Number(args.temperature) : undefined,
        endpoint: args.endpoint,
        model: args.model,
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
      config.ai.endpoint,
      config.ai.accessKey,
      config.ai.model,
      config.ai.maxTokens,
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
