import type { ExtensionContext } from 'vscode'
import { Logger } from '../vscode/logger.js'
import { Storage } from '../vscode/storage.js'
import { AUTH_TOKEN_NAMES_KEY } from '../constants.js'

export function listAuthTokensCommand(context: ExtensionContext) {
  Logger.info(`Initializing 'listAuthTokens' command...`)

  return async () => {
    Logger.info(`Starting 'listAuthTokens' command...`)

    Logger.info('Listing authorization tokens...')
    const storage = new Storage(context.globalState)
    const tokenNames = JSON.parse(await storage.get(AUTH_TOKEN_NAMES_KEY) || '[]') as string[]

    if (tokenNames.length === 0) {
      Logger.info('No authorization tokens found.')
      return
    }

    Logger.info('Authorization tokens:')
    tokenNames.forEach((tokenName) => {
      Logger.info(`- ${tokenName}`)
    })
    Logger.showChannel()
  }
}
