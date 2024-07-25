import { AssertionError } from 'node:assert'
import { type ExtensionContext, window } from 'vscode'
import { Logger } from '../Logger.js'
import type { Awaitable } from '../types/index.js'

export class BaseCommand {
  static readonly id: string = ''
  protected readonly logger: Logger

  constructor(protected id: string, protected context: ExtensionContext) {
    this.logger = Logger.createWithPrefix(id)
  }

  assert(value: unknown, message: string): asserts value {
    if (!value) {
      window.showErrorMessage(message)
      throw new AssertionError({ message })
    }
  }

  run(): Awaitable<void> {
    throw new Error('Method not implemented.')
  }

  execute(): () => Promise<void> {
    return async () => {
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
}
