import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import { Logger } from '../vscode/logger.js'
import { Storage } from '../vscode/storage.js'
import { Configuration } from '../vscode/configuration.js'
import { AI_CONFIG_KEY, AUTH_TOKEN_NAMES_KEY } from '../constants.js'
import type { AIConfig } from '../types.js'

export function createAICommand(context: ExtensionContext) {
  Logger.info(`Initializing 'createAI' command...`)

  return async () => {
    Logger.info(`Starting 'createAI' command...`)

    const storage = new Storage(context.globalState)
    const configuration = new Configuration()

    Logger.info('Asking for AI name...')
    const name = await window.showInputBox({
      prompt: 'Enter a name for your AI',
      placeHolder: 'AI name',
    })

    if (!name) {
      Logger.error('No AI name provided. Please try again.')
      return
    }

    const ai: AIConfig = configuration.get(AI_CONFIG_KEY) || {}
    const aiNames = Object.keys(ai)

    if (aiNames.includes(name)) {
      Logger.error('AI with the same name already exists. Please try again.')
      return
    }

    Logger.info('Asking for the preset...')
    // TODO: define preset and use a select list
    const preset = await window.showInputBox({
      prompt: 'Enter the preset for your AI',
      placeHolder: 'Preset',
    })

    if (!preset) {
      Logger.error('No preset provided. Please try again.')
      return
    }

    // TODO: if custom, ask for the model ...

    Logger.info('Asking for the token name...')
    const tokenNames = JSON.parse(await storage.get(AUTH_TOKEN_NAMES_KEY) || '[]') as string[]
    const tokenName = await window.showQuickPick(
      tokenNames,
      {
        placeHolder: 'Select a token to use',
      },
    )

    if (!tokenName) {
      Logger.error('No token name provided. Please try again.')
      return
    }

    Logger.info('Saving AI...')
    const updatableAi = { ...ai }
    updatableAi[name] = {
      preset,
      tokenName,
    }
    await configuration.update(AI_CONFIG_KEY, updatableAi)

    window.showInformationMessage(`AI '${name}' created.`)
  }
}
