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

  static log(message: string, options?: { notification?: boolean | { message: string } }): void {
    Logger.channel.appendLine(`[${this.now()}] ${message}`)

    if (options?.notification) {
      const notificationMessage = typeof options.notification === 'object' ? options.notification.message : message

      window.showInformationMessage(notificationMessage)
    }
  }

  static now(): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date())
  }

  log(message: string, options?: { notification?: boolean }): void {
    Logger.log(`${this.prefix}: ${message}`, {
      notification: options?.notification ? { message } : undefined,
    })
  }

  static createWithPrefix(prefix: string): Logger {
    return new Logger(prefix)
  }
}
