import { workspace } from 'vscode'
import type { Action, QuickAction } from '../types/index.js'
import { BaseCommand } from './base_command.js'
import { RunActionCommand } from './run_action_command.js'

export class RunQuickActionCommand extends BaseCommand {
  action: Action | undefined

  protected async run(): Promise<void> {
    const quickAction = this.getQuickAction()

    await this.executeAction(quickAction.action)
  }

  protected async executeAction(actionName: string): Promise<void> {
    const RunAction = new RunActionCommand('runAction', this.context)

    await RunAction.execute(actionName)
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
