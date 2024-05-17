import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import { SecretsStorage } from '../vscode/secrets_storage.js'
import { Logger } from '../vscode/logger.js'
import { Storage } from '../vscode/storage.js'
import { AUTH_TOKEN_NAMES_KEY } from '../constants.js'

export function deleteAuthTokenCommand(context: ExtensionContext) {
  Logger.info('Initializing deleteAuthTokenCommand...')

  return async () => {
    Logger.info('Start delete authorization token...')

    const storage = new Storage(context.globalState)
    const secretsStorage = new SecretsStorage(
      context.secrets,
    )

    const tokenNames = JSON.parse(await storage.get(AUTH_TOKEN_NAMES_KEY) || '[]') as string[]

    Logger.info('Asking for authorization token name...')
    const name = await window.showQuickPick(
      tokenNames,
      {
        placeHolder: 'Select a token to delete',
      },
    )

    if (!name) {
      Logger.error('No token name provided. Please try again.')
      return
    }

    Logger.info('Deleting authorization token name...')
    await storage.save(AUTH_TOKEN_NAMES_KEY, JSON.stringify(tokenNames.filter(tokenName => tokenName !== name)))

    Logger.info('Deleting authorization token...')
    await secretsStorage.delete(name)

    window.showInformationMessage(`Authorization token '${name}' deleted.`)
  }
}
