import * as vscode from 'vscode'
import { addOpenAIKey, removeOpenAIKey } from './secrets'
import { descriptionCommand } from './commands/description'
import { correctCommand } from './commands/correct'

export function activate(context: vscode.ExtensionContext) {
  const secrets = context.secrets

  const addOpenAIKeyCommand = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.addOpenAIKey', async () => {
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

    vscode.window.showInformationMessage('OpenAI key added.')
  })

  const removeOpenAIKeyCommand = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.removeOpenAIKey', async () => {
    await removeOpenAIKey(secrets)

    vscode.window.showInformationMessage('OpenAI key removed.')
  })

  const correctCommandDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.correct', correctCommand(context))
  const descriptionCommandDisposable = vscode.commands.registerCommand('barbapapazes.utils-ai-vscode.description', descriptionCommand(context))

  context.subscriptions.push(addOpenAIKeyCommand, removeOpenAIKeyCommand, correctCommandDisposable, descriptionCommandDisposable)
}

export async function deactivate(context: vscode.ExtensionContext) {
  const secrets = context.secrets

  await removeOpenAIKey(secrets)
}
