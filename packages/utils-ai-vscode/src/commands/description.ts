import * as vscode from 'vscode'
import { Descriptor, DescriptorOptions, FetcherOptions, HttpFetcher, Prompter, PrompterOptions, SimpleMessagesFactory } from 'utils-ai'
import { getOpenAIKey } from '../secrets'

export function descriptionCommand(context: vscode.ExtensionContext) {
  const secrets = context.secrets

  return async () => {
    const time = Date.now()
    const editor = vscode.window.activeTextEditor

    // TODO: could create from selection, and if no selection, from the whole document (if file is too big, add a warning message)

    if (editor) {
      const accessKey = await getOpenAIKey(secrets)

      if (!accessKey) {
        vscode.window.showErrorMessage('No key provided. Please provide a key using the "Add OpenAI Key" command.')
        return
      }

      // TODO: use the preferred language from the settings
      const prompterOptions = new PrompterOptions(
        'en',
      )
      const prompter = new Prompter(prompterOptions)
      const prompt = prompter.find('descriptor')

      const filename = editor.document.fileName
      const text = editor.document.getText()

      try {
        // start a loading notification
        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: 'Utils AI: Generating description',
          cancellable: false,
        }, async () => {
          const messagesFactory = new SimpleMessagesFactory()

          // TODO: use from the settings
          const fetcherOptions = new FetcherOptions(
            'https://api.openai.com/v1/chat/completions',
            accessKey,
            'gpt-3.5-turbo',
            1024,
          )
          const fetcher = new HttpFetcher(fetcherOptions)

          const descriptorOptions = new DescriptorOptions(prompt.message)
          const descriptor = new Descriptor(
            messagesFactory,
            fetcher,
            descriptorOptions,
          )
          const description = await descriptor.execute(text)

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
