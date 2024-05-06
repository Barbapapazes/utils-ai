import { readFileSync, writeFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import { mergeConfig } from '../config.js'
import { mustBeMarkdown } from '../file.js'
import { SimpleMessagesFactory } from '../../message_factory.js'
import { SimpleTokenizer } from '../../tokenizer.js'
import { SimpleSplitter } from '../../splitter.js'
import { FetcherOptions, HttpFetcher } from '../../fetcher.js'
import { Correcter, CorrecterOptions } from '../../features/correcter.js'
import type { Language } from '../../prompter.js'
import { Prompter, PrompterOptions } from '../../prompter.js'

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
    // TODO: use number
    contextWindow: {
      type: 'string',
      required: false,
      description: '',
    },
    // TODO: use number
    outputTokens: {
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
    const prompt = prompter.find('spell-checker')

    const messagesFactory = new SimpleMessagesFactory()

    const tokenizer = new SimpleTokenizer()
    const splitter = new SimpleSplitter(tokenizer)

    const fetcherOptions = new FetcherOptions(
      config.ai.authToken,
      config.ai.endpoint,
      config.ai.model,
    )
    const fetcher = new HttpFetcher(fetcherOptions)

    const correcterOption = new CorrecterOptions(
      prompt.message,
      /**
       * Correct command will return the same amount of tokens as the input the the chunk size must be the smaller between the smaller (`outputTokens` is always smaller than the `contextWindow`.
       */
      config.ai.outputTokens,
    )
    const correcter = new Correcter(messagesFactory, tokenizer, splitter, fetcher, correcterOption)

    const correctedText = await correcter.execute(file)

    writeFileSync(args.filename, correctedText, 'utf-8')
  },
})

function toNumber(value: string | undefined): number | undefined {
  return value ? Number(value) : undefined
}
