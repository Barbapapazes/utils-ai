import { defineCommand, runMain } from 'citty'
import utilsAIPackage from '#package.json' assert { type: 'json' }

const main = defineCommand({
  meta: {
    name: utilsAIPackage.name,
    version: utilsAIPackage.version,
    description: utilsAIPackage.description,
  },
  subCommands: {
    setup: () => import('./commands/setup.js').then(m => m.default),
    correct: () => import('./commands/correct.js').then(m => m.default),
    description: () => import('./commands/description.js').then(m => m.default),
  },
})

export { runMain, main }
