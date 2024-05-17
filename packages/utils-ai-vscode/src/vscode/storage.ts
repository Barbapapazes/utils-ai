import type { Memento } from 'vscode'

export class Storage {
  constructor(
    private storage: Memento,
  ) {}

  /**
   * Get data from the storage.
   */
  async get(key: string): Promise<string | undefined> {
    return this.storage.get(key) as Promise<string | undefined>
  }

  /**
   * Save data to the storage.
   */
  async save(key: string, value: string) {
    this.storage.update(key, value)
  }

  /**
   * Delete data from the storage.
   */
  async delete(key: string) {
    this.storage.update(key, undefined)
  }
}
