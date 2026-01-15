import { AssertionError } from 'node:assert'
import { window, workspace } from 'vscode'
import type { WorkspaceConfiguration } from 'vscode'
import type { Action, AI, Prompt } from '../types/index.js'

export class Base {
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
}
