import * as vscode from 'vscode'
import { addOpenAIKey, getOpenAIKey, removeOpenAIKey } from './secrets'
import { descriptionCommand } from './commands/description'
import { correctCommand } from './commands/correct'

export function activate(context: vscode.ExtensionContext) {
  const secrets = context.secrets

  const addOpenAIKeyCommand = vscode.commands.registerCommand('utils-ai.addOpenAIKey', async () => {
    const key = await vscode.window.showInputBox({
      prompt: 'Enter your OpenAI API key',
      placeHolder: 'OpenAI API key',
      password: true,
    })

    if (!key) {
      vscode.window.showErrorMessage('No key provided. Please try again.')
      return
    }

    await addOpenAIKey(key, secrets)
  })

  const removeOpenAIKeyCommand = vscode.commands.registerCommand('utils-ai.removeOpenAIKey', async () => {
    await removeOpenAIKey(secrets)
  })

  const correctCommandDisposable = vscode.commands.registerCommand('utils-ai.correct', correctCommand(context))
  const descriptionCommandDisposable = vscode.commands.registerCommand('utils-ai.description', descriptionCommand(context))

  context.subscriptions.push(addOpenAIKeyCommand, removeOpenAIKeyCommand, correctCommandDisposable, descriptionCommandDisposable)
}

export async function deactivate(context: vscode.ExtensionContext) {
  const secrets = context.secrets

  await removeOpenAIKey(secrets)
}
