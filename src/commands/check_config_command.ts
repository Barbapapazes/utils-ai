import { workspace } from 'vscode'
import type { AI, Action, Prompt } from '../types/index.js'
import { BaseCommand } from './base_command.js'

export class CheckConfigCommand extends BaseCommand {
  async run(): Promise<void> {
    const prompts = await this.getPrompts()
    const ai = await this.getAI()
    const actions = await this.getActions()

    this.checkActions(prompts, ai, actions)

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

  protected checkAI(ai: AI[]): void {
    for (const aiConfig of ai) {
      const key = this.context.secrets.get(aiConfig.keyName)

      this.assert(key, `Key '${aiConfig.keyName}' not found.`)
    }
  }

  protected async getPrompts(): Promise<Prompt[]> {
    const prompts = workspace.getConfiguration('utilsAi').get<Prompt[]>('prompts')

    this.assert(prompts, 'Prompts are required.')

    return prompts
  }

  protected async getAI(): Promise<AI[]> {
    const ai = workspace.getConfiguration('utilsAi').get<AI[]>('ai')

    this.assert(ai, 'AI is required.')

    return ai
  }

  protected async getActions(): Promise<Action[]> {
    const actions = workspace.getConfiguration('utilsAi').get<Action[]>('actions')

    this.assert(actions, 'Actions are required.')

    return actions
  }
}
