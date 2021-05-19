import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import Backend from 'i18next-chained-backend'
import LocalStorageBackend from 'i18next-localstorage-backend'; // primary use cache
import XHR from 'i18next-xhr-backend' // fallback xhr load

const detectorOptions = {
  // order and from where user language should be detected
  order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],

  // keys or params to lookup language from
  lookupQuerystring: 'hl',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',

  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'] // languages to not persist (cookie, localStorage)
}

const cacheOptions = {
  // turn on or off
  enabled: false,
  // prefix for stored languages
  prefix: 'i18next_res_',
  // expiration
  expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  // language versions
  versions: {
    ru: 'v1.1.79',
    en: 'v1.0.17'
  }
}

const options = {
  fallbackLng: 'ru',
  whitelist: ['ru', 'en'],
  load: 'languageOnly', // we only provide en, de -> no region specific locals like en-US, de-DE

  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',

  debug: false,

  // cache: cacheOptions,
  detection: detectorOptions,

  skipInterpolation: true,
  /* interpolation: {
    escapeValue: false, // not needed for react!!
    /* formatSeparator: ',',
    format: (value, format, lng) => {
      if (format === 'uppercase') return value.toUpperCase()
      return value
    }
  }, */
  backend: {
    backends: [
      LocalStorageBackend,  // primary
      XHR                   // fallback
    ],
    backendOptions: [
      cacheOptions,
      {
        loadPath: '/locales/{{lng}}/{{ns}}.json' // xhr load path for my own fallback
      }
    ]
  },
  react: {
    useSuspense: false
  }
}

// for browser use xhr backend to load translations and browser lng detector
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next

// initialize if not already initialized
if (!i18n.isInitialized) i18n.init(options)

export default i18n
