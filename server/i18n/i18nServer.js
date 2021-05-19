import i18n from 'i18next'
import Backend from 'i18next-node-fs-backend'
import { LanguageDetector } from 'i18next-express-middleware'
import { initReactI18next } from 'react-i18next'

const detectorOptions = {
  // order and from where user language should be detected
  order: [/*'path', 'session', */ 'querystring', 'cookie', 'header'],

  // keys or params to lookup language from
  lookupQuerystring: 'hl',
  lookupCookie: 'i18next',
  lookupHeader: 'accept-language',

  // cache user language on
  caches: false
}

// init i18next with serverside settings
// using i18next-express-middleware
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    whitelist: ['en', 'ru'],
    defaultNS: 'common',
    preload: ['en', 'ru'], // preload all languages
    // have a common namespace used around the full app
    // ns: ['common', 'notFound', 'notification', 'post', 'user'],
    ns: ['common', 'aboutUs', 'account', 'album', 'ask', 'audioPlayer', 'book', 'bookCoverDesign', 'books', 'comment', 'contest', 'editor', 'emailVerify', 'event', 'footer', 'form', 'genres', 'helpAndFaq', 'home', 'imageEditor', 'landing', 'login', 'message', 'notif', 'notif_public', 'notFound', 'notification', 'payment', 'post', 'press', 'order', 'recover', 'referral', 'ryfmator', 'room', 'search', 'sidebar', 'signup', 'tagsPage', 'upgrade', 'user', 'welcome'/* 'levitan' */], // need to preload all the namespaces
    debug: false,
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
      // loadPath: process.env.PWD + '/public/locales/{{lng}}/{{ns}}.json'
      loadPath: process.env.NODE_ENV === 'production' ? '/locales/{{lng}}/{{ns}}.json' : process.env.PWD + '/public/locales/{{lng}}/{{ns}}.json'
    },
    react: {
      useSuspense: false
    }
  })

export default i18n
