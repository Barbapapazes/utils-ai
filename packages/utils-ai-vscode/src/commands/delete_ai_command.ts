import { window } from 'vscode'
import { AI_CONFIG_KEY } from '../constants.js'
import { Configuration } from '../vscode/configuration.js'
import { Logger } from '../vscode/logger.js'
import type { AIConfig } from '../types.js'

export function deleteAiCommand() {
  Logger.info('Initializing deleteAiCommand...')

  return async () => {
    Logger.info('Start delete AI command...')

    const configuration = new Configuration()

    const ai = configuration.get<AIConfig>(AI_CONFIG_KEY) || {}
    const aiNames = Object.keys(ai)

    Logger.info('Asking for AI name...')
    const name = await window.showQuickPick(
      aiNames,
      {
        placeHolder: 'Select an AI to delete',
      },
    )

    if (!name) {
      Logger.error('No AI name provided. Please try again.')
      return
    }

    Logger.info('Deleting AI...')
    // By default, `ai` is a reference to the configuration value, so we need to clone it to avoid mutating the original value (which throw an error).
    const updatableAi = { ...ai }
    delete updatableAi[name]
    await configuration.update(AI_CONFIG_KEY, updatableAi)

    window.showInformationMessage(`AI '${name}' deleted.`)
  }
}
