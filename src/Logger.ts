import { type OutputChannel, window } from 'vscode'

export class Logger {
  constructor(protected prefix: string) {}

  static readonly channelName = 'Utils AI'

  static channel: OutputChannel

  static createChannel(): void {
    if (this.channel)
      return

    Logger.channel = window.createOutputChannel(Logger.channelName)
  }

  static log(message: string, options?: { notification?: boolean }): void {
    Logger.channel.appendLine(message)

    if (options?.notification)
      window.showInformationMessage(message)
  }

  log(message: string, options?: { notification?: boolean }): void {
    Logger.log(`${this.prefix}: ${message}`, options)
  }

  static createWithPrefix(prefix: string): Logger {
    return new Logger(prefix)
  }
}
