import type { ExtensionContext } from 'vscode'
import { commands as vsCommands, workspace } from 'vscode'
import { Logger } from './core/Logger.js'
import { commands } from './commands/index.js'
import type { QuickAction } from './types/index.js'

export function activate(context: ExtensionContext): void {
  Logger.createChannel()

  Logger.log('Activating extension...')

  Logger.log('Set context...')
  vsCommands.executeCommand('setContext', 'barbapapazes.utils-ai.showQuickAction', workspace.getConfiguration('utilsAi').get<QuickAction>('quickAction')?.fileTypes ?? [])

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
