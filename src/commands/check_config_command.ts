import { workspace } from 'vscode'
import type { AI, Action, Prompt, QuickAction } from '../types/index.js'
import { BaseCommand } from './base_command.js'

export class CheckConfigCommand extends BaseCommand {
  async run(): Promise<void> {
    const prompts = this.getPrompts()
    const ai = this.getAI()
    const actions = this.getActions()
    const quickAction = this.getQuickAction()

    this.checkActions(prompts, ai, actions)

    if (quickAction) {
      this.checkQuickAction(quickAction, actions)
    }

    this.checkAI(ai)

    this.logger.log('Configuration is valid.', {
      notification: true,
    })
  }

  protected checkActions(prompts: Prompt[], ai: AI[], actions: Action[]): void {
    for (const action of actions) {
      this.assert(prompts.find(({ name }) => name === action.prompt), `Prompt '${action.prompt}' not found.`)
      this.assert(ai.find(({ name }) => name === action.ai), `AI '${action.ai}' not found.`)
    }
  }

  protected checkQuickAction(quickAction: QuickAction, actions: Action[]): void {
    this.assert(actions.find(({ name }) => name === quickAction.action), `Action '${quickAction.action}' not found.`)
  }

  protected checkAI(ai: AI[]): void {
    for (const aiConfig of ai) {
      const key = this.context.secrets.get(aiConfig.keyName)

      this.assert(key, `Key '${aiConfig.keyName}' not found.`)
    }
  }

  protected getPrompts(): Prompt[] {
    const prompts = workspace.getConfiguration('utilsAi').get<Prompt[]>('prompts')

    this.assert(prompts, 'Prompts are required.')

    return prompts
  }

  protected getAI(): AI[] {
    const ai = workspace.getConfiguration('utilsAi').get<AI[]>('ai')

    this.assert(ai, 'AI is required.')

    return ai
  }

  protected getActions(): Action[] {
    const actions = workspace.getConfiguration('utilsAi').get<Action[]>('actions')

    this.assert(actions, 'Actions are required.')

    return actions
  }

  protected getQuickAction(): QuickAction | undefined {
    const quickAction = workspace.getConfiguration('utilsAi').get<QuickAction | undefined>('quickAction')

    return quickAction
  }
}
