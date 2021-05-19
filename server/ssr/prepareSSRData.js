import { detectMobile, detectTablet, detectBot } from '/lib/utils/deviceDetect'

const prepareSSRData = async (sink) => {
  const req = sink.request
  const initPath = req.url.path
  const pathArr = initPath.split('?')
  let path = initPath
  if (pathArr.length > 1) {
    path = pathArr[0]
    // path = path.replace(/\?hl=(.*)+/gi, '')
  }

  /* const ssr = htmlCache[initPath]
  if (ssr) sink.appendToHead("<style id='ssr-css'>"+sharedCss+"</style>")
  sink.renderIntoElementById("react-root", ssr) */

  if (path === '/levitan' ||
      path === '/packages/bundle.umd.js.map' ||
      path === '/json' ||
      path === '/json/version' ||
      path === '/undefined'
  ) {

  } else {
    const isAMP = path.startsWith('/amp/')
    const isAuthPage = path.indexOf('/me') === 0 ||
      path === '/new-album' ||
      path === '/new-contest' ||
      path === '/new-book' ||
      path === '/new-chapter' ||
      path === '/new-post' ||
      path.indexOf('/edit') > -1

    // const query = req.url.query
    const headers = req.headers
    const userAgent = headers['user-agent']
    const cookies = sink.getCookies()
    const { i18next, feedView, rTheme, readCookie, readAnounce, webPushSubscribed } = cookies
    const loginToken = headers['meteor-login-token'] || cookies['meteor_login_token']

    if (!loginToken && isAuthPage) {
      // Redirect to login
      sink.redirect('/login?referer=' + path)
      return
    }

    let locale = 'ru'
    if (req.url.query?.hl) {
      locale = req.url.query?.hl
    } else {
      if (i18next) {
        if (i18next.indexOf('-') > -1) {
          locale = i18next.split('-')[0]
        } else {
          locale = i18next
        }
      }
    }

    const authContext = {
      token: loginToken,
      currUser: null,
      currUserId: null,
      isPremium: false
    }

    let settingsContext = {
      locale: locale,
      feedView: feedView || 'default',
      rTheme: rTheme || 'sun',
      readCookie: readCookie ? parseInt(readCookie, 10) : 0,
      readAnounce: readAnounce ? parseInt(readAnounce, 10) === 3 : 3,
      readWebPush: webPushSubscribed ? parseInt(webPushSubscribed, 10) : 0,
      isMobile: false,
      isTablet: false
    }

    let isBot = false
    if (userAgent) {
      const [
        isBot,
        isMobile,
        isTablet
      ] = await Promise.all([
        detectBot(userAgent),
        detectMobile(userAgent),
        detectTablet(userAgent)
      ])
      settingsContext.isMobile = isMobile
      settingsContext.isTablet = isTablet
      settingsContext.isBot = isBot
    }

    let preKey = {
      path,
      isAMP,
      locale: settingsContext.locale,
      rTheme: settingsContext.rTheme,
      isMobile: settingsContext.isMobile,
      isTablet: settingsContext.isTablet,
    }

    if (loginToken) {
      preKey.token = loginToken
    }

    const key = JSON.stringify(preKey).replace(/[{}"]/g, '').replace(/[:,]/g, '_')

    return {
      path, authContext, settingsContext, isBot, headers, cookies, key, isAMP
    }
  }

  return null
}

export default prepareSSRData
