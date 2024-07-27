import type { ExtensionContext } from 'vscode'
import { commands as vsCommands } from 'vscode'
import { Logger } from './core/Logger.js'
import { commands } from './commands/index.js'

export function activate(context: ExtensionContext): void {
  Logger.createChannel()

  Logger.log('Activating extension...')

  Logger.log('Registering commands...')
  for (const [key, Command] of Object.entries(commands)) {
    const command = new Command(key, context)
    const disposable = vsCommands.registerCommand(`barbapapazes.utils-ai.${key}`, command.execute())
    context.subscriptions.push(disposable)
  }
}

export function deactivate(_: ExtensionContext): void {
  Logger.log('Deactivating extension...')
}
