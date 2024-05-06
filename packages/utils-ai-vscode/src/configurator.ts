import type * as vscode from 'vscode'
import { assertIsDefined } from '@poppinss/utils/assert'
import type { Endpoint, Language, Model, Prompts } from 'utils-ai'

export class Configurator {
  #messagePrefix = 'utils-ai-vscode:'

  #key = 'utilsAi'

  #configuration: vscode.WorkspaceConfiguration

  constructor(
    public workspace: typeof vscode.workspace,
  ) {
    this.#configuration = this.workspace.getConfiguration(this.#key)
  }

  get endpoint(): Endpoint {
    const endpoint = this.#configuration.get<Endpoint>('endpoint')
    assertIsDefined(endpoint, `${this.#messagePrefix} Endpoint not found in configuration`)

    return endpoint
  }

  get model(): Model {
    const model = this.#configuration.get<Model>('model')
    assertIsDefined(model, `${this.#messagePrefix} Model not found in configuration`)

    return model
  }

  get contextWindow(): number {
    const contextWindow = this.#configuration.get<number>('contextWindow')
    assertIsDefined(contextWindow, `${this.#messagePrefix} Context window not found in configuration`)

    return contextWindow
  }

  get outputTokens(): number {
    const outputTokens = this.#configuration.get<number>('outputTokens')
    assertIsDefined(outputTokens, `${this.#messagePrefix} Output tokens not found in configuration`)

    return outputTokens
  }

  get preferredLanguage(): Language {
    const preferredLanguage = this.#configuration.get<Language>('preferredLanguage')
    assertIsDefined(preferredLanguage, `Preferred language not found in configuration`)

    return preferredLanguage
  }

  get supportedExtensions(): string[] {
    const preferredExtensions = this.#configuration.get<string[]>('supportedExtensions')
    assertIsDefined(preferredExtensions, `Supported extensions not found in configuration`)

    return preferredExtensions
  }

  get alwaysAskLanguage(): boolean {
    const alwaysAskLanguage = this.#configuration.get<boolean>('alwaysAskLanguage')
    assertIsDefined(alwaysAskLanguage, `Always ask language not found in configuration`)

    return alwaysAskLanguage
  }

  get prompts(): Prompts {
    const prompts = this.#configuration.get<Prompts>('prompts')
    assertIsDefined(prompts, `Prompts not found in configuration`)

    return prompts
  }
}