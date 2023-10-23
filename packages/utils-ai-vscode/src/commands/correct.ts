import * as vscode from 'vscode'
import { correct, getPrompt } from 'utils-ai'
import { getOpenAIKey } from '../secrets'

export function correctCommand(context: vscode.ExtensionContext) {
  const secrets = context.secrets

  return async () => {
    const time = Date.now()
    const editor = vscode.window.activeTextEditor

    if (editor) {
      const accessKey = await getOpenAIKey(secrets)

      if (!accessKey) {
        vscode.window.showErrorMessage('No key provided. Please provide a key using the "Add OpenAI Key" command.')
        return
      }

      const prompt = getPrompt('spell-checker-md', 'en')
      const filename = editor.document.fileName
      const text = editor.document.getText()

      try {
        // start a loading notification
        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: `Correcting ${filename}. Please wait...`,
          cancellable: false,
        }, async () => {
          const correctedText = await correct(text, prompt.message, { ai: { accessKey } })

          // replace the text with the corrected text
          editor.edit((editBuilder) => {
            editBuilder.replace(new vscode.Range(0, 0, text.length, 0), correctedText)
          })

          const duration = Date.now() - time
          // show a success notification
          vscode.window.showInformationMessage(`Corrected text in ${filename}`, {
            detail: `Done in ${duration}ms.`,
          })
        })
      }
      catch (error: any) {
        vscode.window.showErrorMessage(error.message)
      }
    }
  }
}
