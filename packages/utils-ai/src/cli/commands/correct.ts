import { readFileSync, writeFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import { mergeConfig } from '../config'
import { mustBeMarkdown } from '../file'
import { SimpleMessagesFactory } from '../../message_factory'
import { SimpleTokenizer } from '../../tokenizer'
import { SimpleSplitter } from '../../splitter'
import { FetcherOptions, HttpFetcher } from '../../fetcher'
import { Correcter, CorrecterOptions } from '../../features'
import type { Language } from '../../prompter'
import { Prompter, PrompterOptions } from '../../prompter'

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
        maxTokens: args.maxTokens ? Number(args.maxTokens) : 1024,
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
    const prompt = prompter.find('spell-checker-md')

    const messagesFactory = new SimpleMessagesFactory()

    const tokenizer = new SimpleTokenizer()
    const splitter = new SimpleSplitter(tokenizer)

    const fetcherOptions = new FetcherOptions(
      config.ai.endpoint,
      config.ai.accessKey,
      config.ai.model,
      config.ai.maxTokens,
    )
    const fetcher = new HttpFetcher(fetcherOptions)

    const correcterOption = new CorrecterOptions(
      prompt.message,
      config.ai.maxTokens,
    )
    const correcter = new Correcter(messagesFactory, tokenizer, splitter, fetcher, correcterOption)

    const correctedText = await correcter.execute(file)

    writeFileSync(args.filename, correctedText, 'utf-8')
  },
})
