import { window } from 'vscode'
import { assertIsDefined } from '@poppinss/utils/assert'
import { Logger } from '../vscode/logger.js'
import { Configuration } from '../vscode/configuration.js'
import type { Prompts } from '../types.js'
import { PROMPTS_CONFIG_KEY } from '../constants.js'

export function createPromptCommand() {
  Logger.info(`Initializing 'createPrompt' command...`)

  return async () => {
    Logger.info(`Starting 'createPrompt' command...`)

    try {
      const configuration = new Configuration()

      Logger.info('Asking for prompt name...')
      const name = await window.showInputBox({
        prompt: 'Enter a name for your prompt',
        placeHolder: 'Prompt name',
      })

      assertIsDefined(name, 'Prompt name is required.')

      const prompts: Prompts = configuration.get<Prompts>(PROMPTS_CONFIG_KEY) || {}
      const promptNames = Object.keys(prompts)

      if (promptNames.includes(name))
        throw new Error('Prompt name already exists.')

      Logger.info('Asking for prompt...')
      const prompt = await window.showInputBox({
        prompt: 'Enter your prompt',
        placeHolder: 'Prompt',
      })

      assertIsDefined(prompt, 'Prompt is required.')

      prompts[name] = prompt

      Logger.info('Saving prompt...')
      await configuration.update(PROMPTS_CONFIG_KEY, prompts)

      window.showInformationMessage(`Prompt '${name}' created.`)
    }
    catch (error) {
      Logger.error(error.message)
    }
  }
}
