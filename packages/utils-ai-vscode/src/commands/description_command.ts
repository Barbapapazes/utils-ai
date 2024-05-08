import * as vscode from 'vscode'
import type { Language } from 'utils-ai'
import { Descriptor, DescriptorOptions, FetcherOptions, HttpFetcher, Prompter, PrompterOptions, SimpleMessagesFactory } from 'utils-ai'
import { Logger } from '../logger.js'
import { Configurator } from '../configurator.js'
import { SecretsStorage } from '../secrets_storage.js'

export function descriptionCommand(context: vscode.ExtensionContext) {
  const logger = new Logger()

  const secretsStorage = new SecretsStorage(
    context.secrets,
  )
  return async () => {
    logger.log('Description command called.')

    const configurator = new Configurator(
      vscode.workspace,
    )

    const preferredLanguage = configurator.alwaysAskLanguage
      ? await vscode.window.showQuickPick(Prompter.LANGUAGES) as Language | undefined || configurator.preferredLanguage
      : configurator.preferredLanguage

    const time = Date.now()
    const editor = vscode.window.activeTextEditor

    // TODO: could create from selection, and if no selection, from the whole document (if file is too big, add a warning message)

    if (editor) {
      const authToken = await secretsStorage.getAuthToken()

      if (!authToken) {
        const message = 'No authorization token provided. Please provide an authorization token using the "Add Auth Token" command.'
        logger.log(message)
        vscode.window.showErrorMessage(message)
        return
      }

      const prompterOptions = new PrompterOptions(
        preferredLanguage,
      )
      const prompter = new Prompter(prompterOptions)
      prompter.merge(configurator.prompts)
      const prompt = prompter.find('descriptor')

      const filename = editor.document.fileName
      logger.log(`File used: ${filename}`)
      const text = editor.document.getText()

      try {
        // start a loading notification
        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: 'Utils AI: Generating description',
          cancellable: false,
        }, async () => {
          const messagesFactory = new SimpleMessagesFactory()

          logger.log(`Generating description with prompt: ${prompt.message}`)
          const fetcherOptions = new FetcherOptions(
            authToken,
            configurator.endpoint,
            configurator.model,
          )
          const fetcher = new HttpFetcher(fetcherOptions)

          const descriptorOptions = new DescriptorOptions(prompt.message)
          const descriptor = new Descriptor(
            messagesFactory,
            fetcher,
            descriptorOptions,
          )
          const description = await descriptor.execute(text)

          // TODO: add a setting to ask the user whether the description should be copy in the file of show in the log (or both).

          const position = editor.selection.active
          // replace the text with the description
          editor.edit((editBuilder) => {
            editBuilder.replace(new vscode.Range(position, position), description)
          })

          await editor.document.save()

          logger.log(`Description generated: ${description}`)
          logger.show()

          const duration = Date.now() - time
          vscode.window.showInformationMessage(`Description generated from ${filename}`, {
            detail: `Done in ${duration}ms.`,
          })
          logger.log(`Description generated in ${duration}ms.`)
        })
      }
      catch (error: any) {
        logger.log(error.message)
        vscode.window.showErrorMessage(error.message)
      }
    }
  }
}
