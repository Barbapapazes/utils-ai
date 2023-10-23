import * as vscode from 'vscode'
import { descriptor, getPrompt } from 'utils-ai'
import { getOpenAIKey } from '../secrets'

export function descriptionCommand(context: vscode.ExtensionContext) {
  const secrets = context.secrets

  return async () => {
    const time = Date.now()
    const editor = vscode.window.activeTextEditor

    // could create from selection, and if no selection, from the whole document (if file is too big, add a warning message)

    if (editor) {
      const accessKey = await getOpenAIKey(secrets)

      if (!accessKey) {
        vscode.window.showErrorMessage('No key provided. Please provide a key using the "Add OpenAI Key" command.')
        return
      }

      const prompt = getPrompt('descriptor', 'en')
      const filename = editor.document.fileName
      const text = editor.document.getText()

      try {
        // start a loading notification
        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: 'Utils AI: Generating description',
          cancellable: false,
        }, async () => {
          const description = await descriptor(text, prompt.message, { ai: { accessKey } })

          const position = editor.selection.active
          // replace the text with the description
          editor.edit((editBuilder) => {
            editBuilder.replace(new vscode.Range(position, position), description)
          })

          await editor.document.save()

          const duration = Date.now() - time
          vscode.window.showInformationMessage(`Description generated from ${filename}`, {
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
