import { window } from 'vscode'
import { BaseCommand } from './base_command.js'

export class RemoveKeyCommand extends BaseCommand {
  readonly keysKey = 'keys'

  protected async run(): Promise<void> {
    const keyName = await window.showQuickPick(this.getKeyNames())

    this.assert(keyName, 'Key name is required.')

    await this.remove(keyName)

    this.logger.log('Key removed successfully.', {
      notification: true,
    })
  }

  protected async remove(name: string): Promise<void> {
    await this.context.secrets.delete(name)
    await this.context.globalState.update(this.keysKey, this.getKeyNames().filter(keyName => keyName !== name))
  }

  protected getKeyNames(): string[] {
    return this.context.globalState.get<[] | undefined>(this.keysKey) || []
  }
}
