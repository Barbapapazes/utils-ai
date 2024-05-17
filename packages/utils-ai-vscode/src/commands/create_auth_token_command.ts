import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import { assertIsDefined } from '@poppinss/utils/assert'
import { SecretsStorage } from '../vscode/secrets_storage.js'
import { Logger } from '../vscode/logger.js'
import { Storage } from '../vscode/storage.js'
import { AUTH_TOKEN_NAMES_KEY } from '../constants.js'

export function createAuthTokenCommand(context: ExtensionContext) {
  Logger.info(`Initializing 'createAuthToken' command...`)

  return async () => {
    Logger.info(`Starting 'createAuthToken' command...`)

    try {
      const storage = new Storage(context.globalState)
      const secretsStorage = new SecretsStorage(
        context.secrets,
      )

      Logger.info('Asking for authorization token name...')
      const name = await window.showInputBox({
        prompt: 'Enter a name for your authorization token',
        placeHolder: 'Token name',
      })

      assertIsDefined(name, 'Token name is required.')

      Logger.info('Asking for authorization token...')
      const token = await window.showInputBox({
        prompt: 'Enter your authorization token',
        placeHolder: 'Token',
        password: true,
      })

      assertIsDefined(token, 'Token is required.')

      Logger.info('Saving authorization token name...')
      const currentTokenNames = JSON.parse(await storage.get(AUTH_TOKEN_NAMES_KEY) || '[]') as string[]

      if (currentTokenNames.includes(name))
        throw new Error('Token name already exists.')

      await storage.save(AUTH_TOKEN_NAMES_KEY, JSON.stringify([...currentTokenNames, name]))

      Logger.info('Saving authorization token...')
      await secretsStorage.save(name, token)

      window.showInformationMessage(`Authorization token '${name}' created.`)
    }
    catch (error) {
      Logger.error(error.message)
    }
  }
}
