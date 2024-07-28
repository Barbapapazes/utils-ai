import type { AI, Action, Prompt, QuickAction } from '../types/index.js'
import { BaseCommand } from './base_command.js'

export class CheckConfigCommand extends BaseCommand {
  protected async run(): Promise<void> {
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

  protected getQuickAction(): QuickAction | undefined {
    const quickAction = this.getConfiguration().get<QuickAction | undefined>('quickAction')

    return quickAction
  }
}
