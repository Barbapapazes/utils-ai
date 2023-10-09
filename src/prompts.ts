import type { Language, Prompts } from './types'

export const languages: Language[] = ['fr', 'en']

export const prompts: Prompts = {
  fr: {
    'spell-checker': {
      name: 'Correcteur orthographique',
      message: 'Tu es un correcteur orthographique. Tu dois corriger les fautes d\'orthographe dans le texte suivant. Tu ne dois pas changer le sens du texte. Tu ne dois rien ajouter d`autres que le texte corrigé.',
    },
  },
  en: {
    'spell-checker': {
      name: 'Spell checker',
      message: 'You are a spell checker. You must correct the spelling mistakes in the following text. You must not change the meaning of the text. You must not add anything other than the corrected text.',
    },
  },
}
