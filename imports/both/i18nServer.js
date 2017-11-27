import { LanguageDetector } from 'i18next-express-middleware'
import Backend from 'i18next-node-fs-backend'
import i18n from './i18n'

// init i18next with serverside settings
// using i18next-express-middleware
i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    whitelist: ['en'],
    fallbackLng: 'en',
    defaultNS: 'common',
    preload: ['en'], // preload all languages
    // have a common namespace used around the full app
    // ns: ['common', 'notFound', 'notification', 'post', 'user'],
    ns: ['common', 'account', 'comment', 'emailVerify', 'login', 'notFound', 'notification', 'post', 'recover', 'referral', 'reputation', 'signup', 'tagsPage', 'user'], // need to preload all the namespaces
    debug: false,
    backend: {
      loadPath: process.env.NODE_ENV === 'production' ? '/locales/{{lng}}/{{ns}}.json' : process.env.PWD + '/public/locales/{{lng}}/{{ns}}.json'
    },
    react: {
      wait: false
    }
  })

export default i18n
