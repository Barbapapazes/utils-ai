import type { TextEditor } from 'vscode'
import { ProgressLocation, Range, window, workspace } from 'vscode'
import type { AI, Action, Prompt } from '../types/index.js'
import { ai as aiIndex } from '../ai/index.js'
import type { BaseAI } from '../ai/base_ai.js'
import { BaseCommand } from './base_command.js'

export class RunActionCommand extends BaseCommand {
  readonly id = 'runAction'

  async run(): Promise<void> {
    this.logger.log('Ask for action...')
    const action = await this.askForAction()

    const configuration = await this.getAIConfiguration(action)
    const prompt = await this.getPrompt(action)

    const ai = await this.createAI(configuration)

    const message = `Ask '${configuration.name}' to '${prompt.name}'...`
    this.logger.log(message)
    await window.withProgress({
      location: ProgressLocation.Notification,
      title: message,
      cancellable: false,
    }, async () => {
      const completion = await ai.ask(prompt.content, this.getActiveEditorText())

      this.logger.log('Apply changes...')
      await this.applyChanges(completion)

      this.logger.log(
        'Action executed successfully.',
        {
          notification: true,
        },
      )
    })
  }

  protected async askForAction(): Promise<Action> {
    const actions = workspace.getConfiguration('utilsAi').get<Action[]>('actions')

    this.assert(actions, 'Actions are required.')

    const actionName = await window.showQuickPick(actions.map(({ name }) => name))

    this.assert(actionName, 'Action is required.')

    const action = actions.find(({ name }) => name === actionName)

    this.assert(action, 'Action not found.')

    return action
  }

  protected async getAIConfiguration(action: Action): Promise<AI> {
    const configuration = workspace.getConfiguration('utilsAi').get<AI[]>('ai')?.find(({ name }) => name === action.ai)

    this.assert(configuration, 'Configuration not found.')

    return configuration
  }

  protected async getPrompt(action: Action): Promise<Prompt> {
    const prompts = workspace.getConfiguration('utilsAi').get<Prompt[]>('prompts')

    this.assert(prompts, 'Prompts are required.')

    const prompt = prompts.find(({ name: promptName }) => promptName === action.prompt)

    this.assert(prompt, 'Prompt not found.')

    return prompt
  }

  protected async createAI(configuration: AI): Promise<BaseAI> {
    const AI = aiIndex[configuration.type]

    this.assert(AI, 'AI not found.')

    const key = await this.context.secrets.get(configuration.keyName)

    this.assert(key, 'Key not found.')

    return new AI(key, {
      model: configuration.model,
    })
  }

  protected getActiveEditor(): TextEditor {
    const editor = window.activeTextEditor

    this.assert(editor, 'No active editor.')

    return editor
  }

  protected getActiveEditorText(): string {
    return this.getActiveEditor().document.getText()
  }

  protected async saveActiveEditor(): Promise<void> {
    this.getActiveEditor().document.save()
  }

  protected async applyChanges(content: string): Promise<void> {
    this.getActiveEditor().edit((editBuilder) => {
      const range = new Range(0, 0, this.getActiveEditorText().length, 0)

      editBuilder.delete(range)
      editBuilder.insert(range.start, content)
    })

    await this.saveActiveEditor()
  }
}
