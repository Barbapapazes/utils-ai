import * as vscode from 'vscode'
import { deleteAuthTokenCommand } from './commands/delete_auth_token_command.js'
import { Configurator } from './configurator.js'
import { Logger } from './vscode/logger.js'
import { createAuthTokenCommand } from './commands/create_auth_token_command.js'
import { deletePromptCommand } from './commands/delete_prompt_command.js'
import { createPromptCommand } from './commands/create_prompt_command.js'
import { createAICommand } from './commands/create_ai_command.js'
import { deleteAiCommand } from './commands/delete_ai_command.js'
import { listAuthTokensCommand } from './commands/list_auth_tokens_command.js'

export function activate(context: vscode.ExtensionContext) {
  Logger.info('Initializing Utils AI extension...')

  /**
   * Set context for the `package.json` because it's an array and using `config.` will interpret as a string.
   */
  const configuration = new Configurator(vscode.workspace)
  vscode.commands.executeCommand('setContext', 'barbapapazes.utils-ai-vscode.supportedExtensions', configuration.supportedExtensions)

  /**
   * Configuration commands
   */
  const listAuthTokensDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.listAuthTokens', listAuthTokensCommand(context))
  const createAuthTokenDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.createAuthToken', createAuthTokenCommand(context))
  const deleteAuthTokenDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.deleteAuthToken', deleteAuthTokenCommand(context))
  const createPromptDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.createPrompt', createPromptCommand())
  const deletePromptDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.deletePrompt', deletePromptCommand())
  const createAIDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.createAI', createAICommand(context))
  const deleteAIDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.deleteAI', deleteAiCommand())

  /**
   * AI commands
   */
  // const correctDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.correct', correctCommand(context))
  // const descriptionDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.description', descriptionCommand(context))

  /**
   * Register commands
   */
  context.subscriptions.push(
    listAuthTokensDisposable,
    createAuthTokenDisposable,
    deleteAuthTokenDisposable,
    createPromptDisposable,
    deletePromptDisposable,
    createAIDisposable,
    deleteAIDisposable,
  )
}

export async function deactivate(context: ExtensionContext) {
  // Clean up
}
