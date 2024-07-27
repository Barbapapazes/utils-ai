import { workspace } from 'vscode'
import type { Action, QuickAction } from '../types/index.js'
import { BaseCommand } from './base_command.js'
import { RunActionCommand } from './run_action_command.js'

export class RunQuickActionCommand extends BaseCommand {
  async run(): Promise<void> {
    const quickAction = this.getQuickAction()
    const action = this.getAction(quickAction.action)

    await this.executeAction(action)
  }

  protected async executeAction(action: Action): Promise<void> {
    const RunAction = new RunActionCommand('runAction', this.context)

    await RunAction.run(action)
  }

  protected getQuickAction(): QuickAction {
    const quickAction = workspace.getConfiguration('utilsAi').get<QuickAction>('quickAction')

    this.assert(quickAction, 'Quick action is required.')

    return quickAction
  }

  protected getAction(actionName: string): Action {
    const action = workspace.getConfiguration('utilsAi').get<Action[]>('actions')?.find(({ name }) => name === actionName)

    this.assert(action, 'Action is required.')

    return action
  }
}
