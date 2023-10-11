import { defineCommand } from 'citty'
import { updateUser } from 'rc9'
import consola from 'consola'
import { configFilename } from '../config'
import type { RC } from '../types'

export default defineCommand({
  meta: {
    name: 'setup',
    description: 'Setup the CLI',
  },
  args: {
    key: {
      type: 'string',
      required: false,
      description: 'The API key to use',
    },
  },
  run: ({ args }) => {
    if (args.key) {
      updateUser<RC>({ ai: { key: args.key } }, configFilename)
      consola.success('API key saved')
    }
  },
})
