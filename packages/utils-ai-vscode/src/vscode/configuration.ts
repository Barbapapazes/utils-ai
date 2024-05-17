import { workspace } from 'vscode'

export class Configuration {
  #configuration = workspace.getConfiguration()

  /**
   * Get the configuration value.
   */
  get<T>(key: string): T | undefined {
    return this.#configuration.get(key)
  }

  /**
   * Update the configuration value.
   */
  update(key: string, value: any, isGlobal = true) {
    return this.#configuration.update(key, value, isGlobal)
  }
}
