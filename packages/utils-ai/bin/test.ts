import process from 'node:process'
import { configure, processCLIArgs, run } from '@japa/runner'
import { assert } from '@japa/assert'
import { ndjson, spec } from '@japa/runner/reporters'

processCLIArgs(process.argv.splice(2))
configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [assert()],
  reporters: {
    activated: ['spec'],
    list: [ndjson(), spec()],
  },
})

run()
