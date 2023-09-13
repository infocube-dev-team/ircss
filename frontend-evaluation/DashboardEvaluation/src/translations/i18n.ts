import i18n, { TOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './en'
import it from './it'

const resources = {
  en: { translation: en },
  it: { translation: it },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

////////////////////////////////////////////////////
// HACK: use languages auto-completion
////////////////////////////////////////////////////
interface TranslationCategory {
  [key: string]: string
}

let TRANSLATION_MAP: any = en

export { TRANSLATION_MAP as T }

// eslint-disable-next-line @typescript-eslint/naming-convention
export const __ = (key: string, interpolationMap?: TOptions) => i18n.t(key, interpolationMap!)

// eslint-disable-next-line @typescript-eslint/naming-convention
export const __UP = (key: string, interpolationMap?: TOptions) => i18n.t(key, interpolationMap!).toUpperCase()

export const changeLanguage = (locale: string) => {
  i18n.changeLanguage(locale)
}

export default i18n
