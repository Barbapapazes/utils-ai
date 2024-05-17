import { defineConfig } from 'tsup'

export default defineConfig({
  external: ['vscode'],
  noExternal: ['utils-ai', 'defu', 'dedent'],
  clean: true,
})
