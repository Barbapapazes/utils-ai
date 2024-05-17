import dedent from 'dedent'
import { window } from 'vscode'

export class Logger {
  static #channel = window.createOutputChannel('Utils AI')

  static #baseLog(message: string) {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[1]
    this.#channel.appendLine(`[${timestamp}] ${dedent(message)}`)
  }

  static info(message: string) {
    this.#baseLog(`[INFO] ${message}`)
  }

  static async error(message: string, prompt = true) {
    this.#baseLog(`[ERROR] ${message}`)

    if (prompt) {
      const result = await window.showErrorMessage(
        message,
        'Show output',
      )

      if (result === 'Show output')
        this.showChannel()
    }
  }

  static showChannel() {
    this.#channel.show()
  }
}
