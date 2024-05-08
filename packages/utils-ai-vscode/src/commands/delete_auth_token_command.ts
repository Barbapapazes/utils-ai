import * as vscode from 'vscode'
import { SecretsStorage } from '../secrets_storage.js'
import { Logger } from '../logger.js'

export function deleteAuthTokenCommand(context: vscode.ExtensionContext) {
  const logger = new Logger()

  const secretsStorage = new SecretsStorage(
    context.secrets,
  )

  return async () => {
    logger.log('Deleting authorization token...')

    await secretsStorage.deleteAuthToken()

    vscode.window.showInformationMessage('Authorization token deleted.')
  }
}
