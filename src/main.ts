import { defineCommand } from 'citty'
import utilsAIPackage from '../package.json' assert { type: 'json' }

export const main = defineCommand({
  meta: {
    name: utilsAIPackage.name,
    version: utilsAIPackage.version,
    description: utilsAIPackage.description,
  },
  subCommands: {
    setup: () => import('./commands/setup').then(m => m.default),
    correct: () => import('./commands/correct').then(m => m.default),
  },
})
