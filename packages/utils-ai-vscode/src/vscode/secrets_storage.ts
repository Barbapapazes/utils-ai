import type { SecretStorage } from 'vscode'

export class SecretsStorage {
  constructor(
    private storage: SecretStorage,
  ) {}

  /**
   * Get data from the secrets storage.
   */
  async get(key: string): Promise<string | undefined> {
    return this.storage.get(key) as Promise<string | undefined>
  }

  /**
   * Save data to the secrets storage.
   */
  async save(key: string, value: string) {
    this.storage.store(key, value)
  }

  /**
   * Delete data from the secrets storage.
   */
  async delete(key: string) {
    this.storage.delete(key)
  }
}
