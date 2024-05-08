import * as vscode from 'vscode'
import type { AuthToken } from 'utils-ai'
import { SecretsStorage } from '../secrets_storage.js'
import { Logger } from '../logger.js'

export function saveAuthTokenCommand(context: vscode.ExtensionContext) {
  const logger = new Logger()

  const secretsStorage = new SecretsStorage(
    context.secrets,
  )

  return async () => {
    logger.log('Saving authorization token...')

    const token = await vscode.window.showInputBox({
      prompt: 'Enter your authorization token',
      placeHolder: 'API token',
      password: true,
    })

    if (!token) {
      vscode.window.showErrorMessage('No token provided. Please try again.')
      return
    }

    await secretsStorage.saveAuthToken(token as AuthToken)

    vscode.window.showInformationMessage('Authorization token added.')
  }
}
