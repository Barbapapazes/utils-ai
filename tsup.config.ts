import { defineConfig } from 'tsup'

export default defineConfig({
  external: ['vscode'],
  noExternal: [],
  clean: true,
})
