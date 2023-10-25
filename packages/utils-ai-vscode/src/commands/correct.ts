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
      const editorFilename = editor.document.fileName // Full path to the file
      const filename = editorFilename.split('/').pop()

      // Commit current file to git before correcting. This is useful for tracking changes.
      const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports
      const isActivated = gitExtension.enabled

      if (!isActivated) {
        vscode.window.showErrorMessage('Git is not activated. Please activate Git in VSCode.')
        return
      }

      if (isActivated) {
        const git = gitExtension.getAPI(1)

        if (git.repositories.length > 0) {
          const repository = git.repositories[0]

          vscode.window.showInformationMessage(`Committing ${filename}...`)

          // Save to be sure to commit the latest changes
          await editor.document.save()

          try {
            await repository.add([editorFilename])
            await repository.commit(`chore: save ${filename} before correcting`)
          }
          catch (error: any) {
            // Ignore error because it's mean that the file is already committed
          }
        }
      }

      const prompt = getPrompt('spell-checker-md', 'en')

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
