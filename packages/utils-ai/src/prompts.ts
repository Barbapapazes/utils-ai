import type { Language, PromptName, Prompts } from './types'

export const languages: Language[] = ['fr', 'en']

export const prompts: Prompts = {
  fr: {
    'spell-checker': {
      name: 'Correcteur orthographique',
      message: 'Tu es un correcteur orthographique. Tu dois corriger les fautes d\'orthographe dans le texte suivant. Tu ne dois pas changer le sens du texte. Tu ne dois rien ajouter d`autres que le texte corrigé.',
    },
    'descriptor': {
      name: 'Génération d\'une description',
      message: 'Tu es un générateur de description. Tu dois générer une description du texte suivant. La description doit être court, pas plus de 2 phrases. La description doit donner envie de lire le texte.',
    },
  },
  en: {
    'spell-checker': {
      name: 'Spell checker',
      message: 'You are a spell checker. You must correct the spelling mistakes in the following text. You must not change the meaning of the text. You must not add anything other than the corrected text.',
    },
    'descriptor': {
      name: 'Description generation',
      message: 'You are a description generator. You must generate a description of the following text. The description must be short, no more than 2 sentences. The description must make you want to read the text.',
    },
  },
}

export function getPrompt(name: PromptName, language: Language) {
  return prompts[language][name]
}
