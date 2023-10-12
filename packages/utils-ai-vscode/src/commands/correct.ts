import * as vscode from 'vscode'
import type { Message } from 'utils-ai'
import { fetchCompletion, getFirstSuggestion, getPrompt } from 'utils-ai'
import { getOpenAIKey } from '../secrets'

export function correctCommand(context: vscode.ExtensionContext) {
  const secrets = context.secrets

  return async () => {
    const editor = vscode.window.activeTextEditor

    if (editor) {
      const key = await getOpenAIKey(secrets)

      if (!key) {
        vscode.window.showErrorMessage('No key provided. Please provide a key using the "Add OpenAI Key" command.')
        return
      }

      const prompt = getPrompt('spell-checker', 'en')
      const text = editor.document.getText()

      const messages: Message[] = [
        {
          role: 'system',
          content: prompt.message,
        },
        {
          role: 'user',
          content: text,
        },
      ]

      try {
        // start a loading notification
        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: 'Utils AI: Correcting text',
          cancellable: false,
        }, async () => {
          // wait for the completion
          const response = await fetchCompletion(messages, { accessKey: key })

          const correctedText = getFirstSuggestion(response)

          // replace the text with the corrected text
          editor.edit((editBuilder) => {
            editBuilder.replace(new vscode.Range(0, 0, text.length, 0), correctedText)
          })
        })
      }
      catch (error: any) {
        vscode.window.showErrorMessage(error.message)
      }
    }
  }
}
