import type * as vscode from 'vscode'

export class Logger {
  #key = 'Utils AI'

  #channel: vscode.OutputChannel

  constructor(
    private window: typeof vscode.window,
  ) {
    this.#channel = this.window.createOutputChannel(this.#key)
  }

  log(message: string) {
    this.#channel.appendLine(message)
  }
}
