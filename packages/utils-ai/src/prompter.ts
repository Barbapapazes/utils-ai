export type Language = 'fr' | 'en'

// TODO: Add support for MDX
export type PromptLanguage = 'md'
export type PromptName = `spell-checker-${PromptLanguage}` | 'descriptor'

export interface Prompt {
  name: string
  message: string
}

export type Prompts = Record<Language, Record<PromptName, Prompt>>

export class PrompterOptions {
  constructor(
    public readonly language: Language,
  ) {}
}

export class Prompter {
  constructor(
    private readonly options: PrompterOptions,
  ) {}

  find(name: PromptName): Prompt {
    return this.#prompts[this.options.language][name]
  }

  #prompts: Prompts = {
    fr: {
      'spell-checker-md': {
        name: 'Correcteur orthographique',
        message: 'Tu es un correcteur orthographique. Tu dois corriger les fautes d\'orthographe dans le texte écrit en markdown suivant. Tu ne dois pas changer le sens du texte. Tu ne dois rien dire d\'autres que le texte corrigé.',
      },
      'descriptor': {
        name: 'Génération d\'une description',
        message: 'Tu es un générateur de description. Tu dois générer une description du texte suivant. La description doit être court, pas plus de 2 phrases. La description doit donner envie de lire le texte.',
      },
    },
    en: {
      'spell-checker-md': {
        name: 'Spell checker',
        message: 'You are a spell checker. You must correct the spelling mistakes in the following text written using markdown. You must not change the meaning of the text. You must not say anything other than the corrected text.',
      },
      'descriptor': {
        name: 'Description generation',
        message: 'You are a description generator. You must generate a description of the following text. The description must be short, no more than 2 sentences. The description must make you want to read the text.',
      },
    },
  }
}
