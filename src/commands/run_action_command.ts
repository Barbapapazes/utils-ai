import type { Selection, TextEditor } from 'vscode'
import { ProgressLocation, Range, extensions, window, workspace } from 'vscode'
import type { AI, Action, Prompt } from '../types/index.js'
import { ai as aiIndex } from '../ai/index.js'
import type { BaseAI } from '../ai/base_ai.js'
import { ActionTreeItem } from '../providers/actions_tree_data_provider.js'
import { BaseCommand } from './base_command.js'

export class RunActionCommand extends BaseCommand {
  protected async run(actionName?: string | ActionTreeItem): Promise<void> {
    const action = await this.getAction(actionName)

    const configuration = await this.getAIConfiguration(action)
    const prompt = await this.getPrompt(action)

    await this.commitWithAction(action, 'before')

    const message = `Ask '${configuration.name}' to '${prompt.name}'...`
    await window.withProgress({
      location: ProgressLocation.Notification,
      title: message,
      cancellable: false,
    }, async () => {
      this.logger.log(message)

      const ai = await this.createAI(configuration)
      const completion = await ai.ask(prompt.content, this.getActiveEditorText())

      if (action.target === 'newfile') {
        await this.showCompletion(completion)
      }
      else {
        await this.applyChanges(completion, action.target)
      }
    })

    await this.commitWithAction(action, 'after')

    this.logger.log(
      `Action '${action.name}' executed successfully.`,
      { notification: true },
    )
  }

  protected async getAction(action?: string | ActionTreeItem): Promise<Action> {
    if (typeof action === 'string') {
      const _action = this.getActions().find(({ name }) => name === action)

      this.assert(_action, 'Action not found.')

      return _action
    }

    if (action instanceof ActionTreeItem) {
      return action.getAction()
    }

    this.logger.log('Ask for action...')
    return await this.askForAction()
  }

  protected async askForAction(): Promise<Action> {
    const actions = this.getActions()

    const actionName = await window.showQuickPick(actions.map(({ name }) => name))

    this.assert(actionName, 'Action is required.')

    const action = actions.find(({ name }) => name === actionName)

    this.assert(action, 'Action not found.')

    return action
  }

  protected async getAIConfiguration(action: Action): Promise<AI> {
    const configuration = this.getAI().find(({ name }) => name === action.ai)

    this.assert(configuration, 'Configuration not found.')

    return configuration
  }

  protected async getPrompt(action: Action): Promise<Prompt> {
    const prompts = this.getPrompts()

    const prompt = prompts.find(({ name: promptName }) => promptName === action.prompt)

    this.assert(prompt, 'Prompt not found.')

    return prompt
  }

  protected async createAI(configuration: AI): Promise<BaseAI> {
    const AI = aiIndex[configuration.provider]

    this.assert(AI, 'AI not found.')

    const key = await this.context.secrets.get(configuration.keyName)

    this.assert(key, 'Key not found.')

    return new AI(key, {
      ...configuration.configuration,
    })
  }

  protected getActiveEditor(): TextEditor {
    const editor = window.activeTextEditor

    this.assert(editor, 'No active editor.')

    return editor
  }

  /**
   * If there is a selection, return the selected text. Otherwise, return the entire text.
   */
  protected getActiveEditorText(): string {
    const selection = this.getActiveEditorSelection()

    if (!selection.isEmpty) {
      return this.getActiveEditor().document.getText(selection)
    }

    return this.getActiveEditor().document.getText()
  }

  protected getActiveEditorSelection(): Selection {
    return this.getActiveEditor().selection
  }

  protected hasActiveEditorSelection(): boolean {
    return !this.getActiveEditorSelection().isEmpty
  }

  protected async saveActiveEditor(): Promise<void> {
    await this.getActiveEditor().document.save()
  }

  protected async applyChanges(content: string, target: Action['target']): Promise<void> {
    this.logger.log('Apply changes...')

    this.getActiveEditor().edit((editBuilder) => {
      const range = this.hasActiveEditorSelection() ? this.getActiveEditorSelection() : new Range(0, 0, this.getActiveEditorText().length, 0)

      if (target === 'replace') {
        editBuilder.delete(range)
      }

      if (target === 'append') {
        editBuilder.insert(range.end, `\n${content}`)
      }
      else if (target === 'replace' || target === 'prepend') {
        editBuilder.insert(range.start, `${content}\n`)
      }
    })

    await this.saveActiveEditor()
  }

  protected async showCompletion(content: string): Promise<void> {
    this.logger.log('Show completion...')

    const editor = await workspace.openTextDocument({ content, language: 'plaintext' })
    await window.showTextDocument(editor)
  }

  protected async commitWithAction(action: Action, when: 'before' | 'after'): Promise<void> {
    let commitMessage = when === 'before' ? action.git?.commitMessageBeforeAction : action.git?.commitMessageAfterAction

    if (!commitMessage) {
      return
    }

    if (commitMessage === '__ask__') {
      commitMessage = await window.showInputBox({ prompt: 'Enter the commit message' })
    }

    this.assert(commitMessage, 'Commit message is required.')

    this.logger.log(`Commit changes ${when} action...`)
    await this.commit(this.getActiveEditor().document.fileName, commitMessage)
  }

  protected async commit(filename: string, message: string): Promise<void> {
    const repository = this.git().repositories[0]

    try {
      await repository.add([filename])
      await repository.commit(message)
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (_: unknown) {
      this.logger.log('No changes to commit.')
      // Ignore error because it's mean that the file is already committed
    }
  }

  protected git(): any {
    const gitExtension = extensions.getExtension('vscode.git')?.exports

    if (!gitExtension.enabled) {
      throw new Error('Git extension is not enabled.')
    }

    return gitExtension.getAPI(1)
  }
}
