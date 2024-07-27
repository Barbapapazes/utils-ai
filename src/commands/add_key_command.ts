import { window } from 'vscode'
import { BaseCommand } from './base_command.js'

export class AddKeyCommand extends BaseCommand {
  protected async run(): Promise<void> {
    const name = await this.askForName()

    const key = await this.askForKey()

    await this.save(name, key)

    this.logger.log('Key added successfully.', {
      notification: true,
    })
  }

  protected async askForName(): Promise<string> {
    const name = await window.showInputBox({ prompt: 'Enter the key name' })

    this.assert(name, 'Key name is required.')

    return name
  }

  protected async askForKey(): Promise<string> {
    const key = await window.showInputBox({ prompt: 'Enter the key', password: true })

    this.assert(key, 'Key is required.')

    return key
  }

  protected async save(name: string, key: string): Promise<void> {
    await this.context.secrets.store(name, key)
    // Used to retrieve all keys later
    const keysKey = 'keys'
    await this.context.globalState.update(keysKey, [
      ...(this.context.globalState.get<[] | undefined>(keysKey) || []),
      name,
    ])
  }
}
