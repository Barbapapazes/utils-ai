import * as vscode from 'vscode'
import { descriptionCommand } from './commands/description_command.js'
import { correctCommand } from './commands/correct_command.js'
import { saveAuthTokenCommand } from './commands/save_auth_token_command.js'
import { deleteAuthTokenCommand } from './commands/delete_auth_token_command.js'
import { SecretsStorage } from './secrets_storage.js'

export function activate(context: vscode.ExtensionContext) {
  /**
   * Configuration commands
   */
  const saveAuthTokenDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.addAuthToken', saveAuthTokenCommand(context))
  const deleteAuthTokenDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.deleteAuthToken', deleteAuthTokenCommand(context))

  /**
   * AI commands
   */
  const correctDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.correct', correctCommand(context))
  const descriptionDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.description', descriptionCommand(context))

  /**
   * Register commands
   */
  context.subscriptions.push(saveAuthTokenDisposable, deleteAuthTokenDisposable, correctDisposable, descriptionDisposable)
}

export async function deactivate(context: vscode.ExtensionContext) {
  const secretsStorage = new SecretsStorage(
    context.secrets,
  )

  await secretsStorage.deleteAuthToken()
}
