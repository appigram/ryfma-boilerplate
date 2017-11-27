import i18n from 'i18next'
import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
// import Cache from 'i18next-localstorage-cache'
// import sprintf from 'i18next-sprintf-postprocessor'

const detectorOptions = {
  // order and from where user language should be detected
  order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],

  // keys or params to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',

  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'] // languages to not persist (cookie, localStorage)
}

/* const cacheOptions = {
  // turn on or off
  enabled: false,
  // prefix for stored languages
  prefix: 'i18next_res_',
  // expiration
  expirationTime: 7 * 24 * 60 * 60 * 1000,
  // language versions
  versions: {}
} */

const options = {
  fallbackLng: 'en',
  whitelist: ['en'],
  load: 'languageOnly', // we only provide en, de -> no region specific locals like en-US, de-DE

  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',

  debug: false,

  // cache: cacheOptions,
  detection: detectorOptions,

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: (value, format, lng) => {
      if (format === 'uppercase') return value.toUpperCase()
      return value
    }
  },
  backend: {
    // path where resources get loaded from
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  },
  react: {
    wait: true
  }
}

// for browser use xhr backend to load translations and browser lng detector
if (typeof window !== 'undefined') {
  i18n
    .use(XHR)
    // .use(Cache)
    // .use(sprintf)
    .use(LanguageDetector)
}

// initialize if not already initialized
if (!i18n.isInitialized) i18n.init(options)

export default i18n
