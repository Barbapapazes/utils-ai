export type Prompts = Record<string, string>

export interface AI {
  preset: string // TODO: Add presets
  tokenName: string
  // TODO: add more fields for custom presets (generics)
}

export type AIConfig = Record<string, AI>
