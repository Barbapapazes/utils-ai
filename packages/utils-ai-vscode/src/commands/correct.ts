import * as vscode from 'vscode'
import { correct, getPrompt } from 'utils-ai'
import { getOpenAIKey } from '../secrets'

export function correctCommand(context: vscode.ExtensionContext) {
  const secrets = context.secrets

  return async () => {
    const accessKey = await getOpenAIKey(secrets)

    if (!accessKey) {
      vscode.window.showErrorMessage('No key provided. Please provide a key using the "Add OpenAI Key" command.')
      return
    }

    const time = Date.now()
    const editor = vscode.window.activeTextEditor

    if (editor) {
      const prompt = getPrompt('spell-checker-md', 'en')
      const filename = editor.document.fileName

      const hasSelection = !editor.selection.isEmpty
      const selection = editor.selection

      // First, use the selection then the whole document
      let text: string
      if (hasSelection)
        text = editor.document.getText(selection)
      else
        text = editor.document.getText()

      try {
        const title = hasSelection ? `Correcting selection in ${filename}. Please wait...` : `Correcting text in ${filename}. Please wait...`
        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title,
          cancellable: false,
        }, async () => {
          const correctedText = await correct(text, prompt.message, { ai: { accessKey } })

          editor.edit((editBuilder) => {
            const range: vscode.Range = hasSelection ? selection : new vscode.Range(0, 0, text.length, 0)

            editBuilder.delete(range)
            editBuilder.insert(range.start, correctedText)
          })

          // Save the document
          await editor.document.save()

          const duration = Date.now() - time
          const message = hasSelection ? `Selection corrected in ${filename}` : `Text corrected in ${filename}`
          vscode.window.showInformationMessage(message, {
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
