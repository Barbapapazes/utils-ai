import { AssertionError } from 'node:assert'
import type { ExtensionContext, WorkspaceConfiguration } from 'vscode'
import { window, workspace } from 'vscode'
import { Logger } from '../core/Logger.js'
import type { AI, Action, Awaitable, Prompt } from '../types/index.js'

export class BaseCommand {
  protected readonly logger: Logger

  constructor(protected id: string, protected context: ExtensionContext) {
    this.logger = Logger.createWithPrefix(id)
  }

  /**
   * Assert a value is defined. Otherwise, it throws an error.
   */
  protected assert(value: unknown, message: string): asserts value {
    if (!value) {
      window.showErrorMessage(message)
      throw new AssertionError({ message })
    }
  }

  protected getConfiguration(): WorkspaceConfiguration {
    return workspace.getConfiguration('utilsAi')
  }

  protected getPrompts(): Prompt[] {
    const prompts = this.getConfiguration().get<Prompt[]>('prompts')

    this.assert(prompts, 'Prompts are required.')

    return prompts
  }

  protected getAI(): AI[] {
    const ai = this.getConfiguration().get<AI[]>('ai')

    this.assert(ai, 'AI are required.')

    return ai
  }

  protected getActions(): Action[] {
    const actions = this.getConfiguration().get<Action[]>('actions')

    this.assert(actions, 'Actions are required.')

    return actions
  }

  protected run(): Awaitable<void> {
    throw new Error('Method not implemented.')
  }

  async execute(): Promise<void> {
    Logger.log(`Executing command: ${this.id}`)

    try {
      await this.run()
    }
    catch (error) {
      Logger.log(error)
    }

    Logger.log(`Command executed: ${this.id}`)
  }
}
