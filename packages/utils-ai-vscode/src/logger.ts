import type * as vscode from 'vscode'

export class Logger {
  static readonly channelName = 'Utils AI'
  static channel: vscode.OutputChannel

  static createChannel(window: typeof vscode.window) {
    if (Logger.channel)
      return

    Logger.channel = window.createOutputChannel(Logger.channelName)
  }

  log(message: string) {
    Logger.channel.appendLine(message)
  }

  show() {
    Logger.channel.show(true)
  }
}
