import { defineConfig } from 'tsup'

export default defineConfig({
  external: ['vscode'],
  noExternal: ['utils-ai'],
  clean: true,
})
