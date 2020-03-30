import { getLocales } from 'react-native-localize'

import { ar, en, ur } from './translations'

type Language = 'ar' | 'en' | 'ur'

export type TranslationKey = keyof typeof en

class Internationalization {
  language: Language = 'en'
  languages = ['ar', 'en', 'ur']
  rtl = false

  translations: Record<Language, Record<string, string>> = {
    ar,
    en,
    ur
  }

  constructor() {
    const { isRTL, languageCode } = getLocales()[0]

    if (this.languages.includes(languageCode)) {
      this.language = languageCode as Language
    }

    this.rtl = isRTL
  }

  t(name: TranslationKey, data?: Record<string, string | number>): string {
    let translation = this.translations[this.language][name]

    if (data) {
      Object.entries(data).forEach(
        ([key, value]) =>
          (translation = translation.replace(`{{${key}}}`, String(value)))
      )
    }

    return translation
  }
}

export const i18n = new Internationalization()
