import * as vscode from 'vscode'
import type { Language } from 'utils-ai'
import { Correcter, CorrecterOptions, FetcherOptions, HttpFetcher, Prompter, PrompterOptions, SimpleMessagesFactory, SimpleSplitter, SimpleTokenizer } from 'utils-ai'
import { Configurator } from '../configurator.js'
import { Logger } from '../logger.js'
import { SecretsStorage } from '../vscode/secrets_storage.js'

export function correctCommand(context: vscode.ExtensionContext) {
  const logger = new Logger()

  const secretsStorage = new SecretsStorage(
    context.secrets,
  )

  return async () => {
    logger.log('Correct command called.')

    const configurator = new Configurator(
      vscode.workspace,
    )

    const authToken = await secretsStorage.getAuthToken()

    if (!authToken) {
      const message = 'No authorization token provided. Please provide an authorization token using the "Add Auth Token" command.'
      logger.log(message)
      vscode.window.showErrorMessage(message)
      return
    }

    const preferredLanguage = configurator.alwaysAskLanguage
      ? await vscode.window.showQuickPick(Prompter.LANGUAGES) as Language | undefined || configurator.preferredLanguage
      : configurator.preferredLanguage

    const time = Date.now()
    const editor = vscode.window.activeTextEditor

    if (editor) {
      const editorFilename = editor.document.fileName // Full path to the file
      logger.log(`File used: ${editorFilename}`)
      const filename = editorFilename.split('/').pop()

      // Commit current file to git before correcting. This is useful for tracking changes.
      const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports
      const isActivated = gitExtension.enabled

      if (!isActivated) {
        const message = 'Git is not activated. Please activate Git in VSCode.'
        logger.log(message)
        vscode.window.showErrorMessage(message)
        return
      }

      if (isActivated) {
        const git = gitExtension.getAPI(1)

        if (git.repositories.length > 0) {
          const repository = git.repositories[0]

          logger.log(`Committing ${filename}...`)
          vscode.window.showInformationMessage(`Committing ${filename}...`)

          // Save to be sure to commit the latest changes
          await editor.document.save()

          try {
            await repository.add([editorFilename])
            await repository.commit(`chore: save ${filename} before correcting`)
          }
          catch (error: any) {
            logger.log('No changes to commit.')
            // Ignore error because it's mean that the file is already committed
          }
        }
      }

      const prompterOptions = new PrompterOptions(
        preferredLanguage,
      )
      const prompter = new Prompter(prompterOptions)
      prompter.merge(configurator.prompts)
      const prompt = prompter.find('spell-checker')

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
          const messagesFactory = new SimpleMessagesFactory()

          const tokenizer = new SimpleTokenizer()
          const splitter = new SimpleSplitter(tokenizer)

          const fetcherOptions = new FetcherOptions(
            authToken,
            configurator.endpoint,
            configurator.model,
          )
          const fetcher = new HttpFetcher(fetcherOptions)

          const correcterOption = new CorrecterOptions(
            prompt.message,
            // Smaller than the context window.
            configurator.outputTokens,
          )
          const corrector = new Correcter(messagesFactory, tokenizer, splitter, fetcher, correcterOption)

          logger.log(`Correcting ${hasSelection ? 'selection' : 'selection'} with prompt: ${prompt.message}`)
          logger.log(`Output tokens: ${configurator.outputTokens}`)
          const correctedText = await corrector.execute(text)

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
          logger.log(`Correction done in ${duration}ms.`)
        })
      }
      catch (error: any) {
        logger.log(error.message)
        vscode.window.showErrorMessage(error.message)
      }
    }
  }
}
