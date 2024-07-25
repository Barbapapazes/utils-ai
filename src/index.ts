import type { ExtensionContext } from 'vscode'
import { commands as vsCommands } from 'vscode'
import { Logger } from './Logger.js'
import { commands } from './commands/index.js'

export function activate(context: ExtensionContext): void {
  Logger.createChannel()

  Logger.log('Activating extension...')

  for (const Command of commands) {
    const command = new Command(context)
    const disposable = vsCommands.registerCommand(`barbapapazes.utils-ai.${command.id}`, command.execute())
    context.subscriptions.push(disposable)
  }
}

export function deactivate(_: ExtensionContext): void {
  Logger.log('Deactivating extension...')
}
