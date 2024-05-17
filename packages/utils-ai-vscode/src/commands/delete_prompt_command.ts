import { window } from 'vscode'
import { PROMPTS_CONFIG_KEY } from '../constants.js'
import type { Prompts } from '../types.js'
import { Logger } from '../vscode/logger.js'
import { Configuration } from '../vscode/configuration.js'

export function deletePromptCommand() {
  Logger.info('Initializing deletePromptCommand...')

  return async () => {
    Logger.info('Start delete prompt command...')

    const configuration = new Configuration()

    const prompts: Prompts = configuration.get<Prompts>(PROMPTS_CONFIG_KEY) || {}
    const promptNames = Object.keys(prompts)

    Logger.info('Asking for prompt name...')
    const name = await window.showQuickPick(
      promptNames,
      {
        placeHolder: 'Select a prompt to delete',
      },
    )

    if (!name) {
      Logger.error('No prompt name provided. Please try again.')
      return
    }

    Logger.info('Deleting prompt...')
    // By default, `prompts` is a reference to the configuration value, so we need to clone it to avoid mutating the original value (which throw an error).
    const updatablePrompts = { ...prompts }
    delete updatablePrompts[name]
    await configuration.update(PROMPTS_CONFIG_KEY, updatablePrompts)

    window.showInformationMessage(`Prompt '${name}' deleted.`)
  }
}
