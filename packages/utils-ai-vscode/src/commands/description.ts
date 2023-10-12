import * as vscode from 'vscode'
import type { Message } from 'utils-ai'
import { fetchCompletion, getFirstSuggestion, getPrompt } from 'utils-ai'
import { getOpenAIKey } from '../secrets'

export function descriptionCommand(context: vscode.ExtensionContext) {
  const secrets = context.secrets

  return async () => {
    const editor = vscode.window.activeTextEditor

    if (editor) {
      const key = await getOpenAIKey(secrets)

      if (!key) {
        vscode.window.showErrorMessage('No key provided. Please provide a key using the "Add OpenAI Key" command.')
        return
      }

      const prompt = getPrompt('descriptor', 'en')
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
          title: 'Utils AI: Generating description',
          cancellable: false,
        }, async () => {
          // wait for the completion
          const response = await fetchCompletion(messages, { accessKey: key })

          // get the first suggestion
          const description = getFirstSuggestion(response)

          const position = editor.selection.active
          // replace the text with the description
          editor.edit((editBuilder) => {
            editBuilder.replace(new vscode.Range(position, position), description)
          })
        })
      }
      catch (error: any) {
        vscode.window.showErrorMessage(error.message)
      }
    }
  }
}
