import type { ExtensionContext } from 'vscode'
import { Base } from '../core/Base.js'
import { Logger } from '../core/Logger.js'
import type { Awaitable } from '../types/index.js'

export abstract class BaseCommand extends Base {
  protected readonly logger: Logger

  constructor(protected id: string, protected context: ExtensionContext) {
    super()

    this.logger = Logger.createWithPrefix(id)
  }

  protected abstract run(..._: unknown[]): Awaitable<void>

  async execute(...args: unknown[]): Promise<void> {
    Logger.log(`Executing command: ${this.id}`)

    try {
      await this.run(...args)
    }
    catch (error) {
      Logger.log(error)
    }

    Logger.log(`Command executed: ${this.id}`)
  }
}
