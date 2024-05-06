import type { AuthToken } from 'utils-ai'
import type * as vscode from 'vscode'

export class SecretsStorage {
  #authTokenKey = 'auth_token'

  constructor(
    private secretsStorage: vscode.SecretStorage,
  ) {}

  /**
   * Save the authorization token to the secrets storage.
   */
  async saveAuthToken(token: AuthToken) {
    this.secretsStorage.store(this.#authTokenKey, token)
  }

  /**
   * Delete the authorization token from the secrets storage.
   */
  async deleteAuthToken() {
    this.secretsStorage.delete(this.#authTokenKey)
  }

  /**
   * Get the authorization token from the secrets storage.
   */
  async getAuthToken(): Promise<AuthToken | undefined> {
    return this.secretsStorage.get(this.#authTokenKey) as Promise<AuthToken | undefined>
  }
}
