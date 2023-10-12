import type * as vscode from 'vscode'

const OPEN_AI_SECRET_KEY = 'openai-key'

export async function addOpenAIKey(key: string, secrets: vscode.SecretStorage) {
  secrets.store(OPEN_AI_SECRET_KEY, key)
}

export async function removeOpenAIKey(secrets: vscode.SecretStorage) {
  secrets.delete(OPEN_AI_SECRET_KEY)
}

export async function getOpenAIKey(secrets: vscode.SecretStorage) {
  return secrets.get(OPEN_AI_SECRET_KEY)
}
