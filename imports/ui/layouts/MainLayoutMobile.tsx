import React, { useEffect, useMemo } from 'react'
// import ym, { YMInitializer } from '@appigram/react-yandex-metrika'

import { useLocation } from 'react-router-dom'
import { useSettings, useAuth } from '/imports/hooks'

import Cookies from 'js-cookie'

import ScrollToTop from '/imports/ui/components/Common/ScrollToTop'
// import NoIndex from '/imports/ui/components/Common/NoIndex'

import Header from '/imports/ui/components/Header/HeaderMobile'
import Footer from '/imports/ui/components/Footer/Footer'
import MobileNavigation from '/imports/ui/components/Header/MobileNavigation'
import NotificationContainer from '/imports/ui/components/Notification/Notification'
import store from '/lib/store'
import getQueryParam from '/lib/utils/helpers/getQueryParam'

let ReactGA = null

function MainLayout ({ Routes }) {
  const { pathname } = useLocation()
  const { currUserId } = useAuth()
  const { rTheme, isTablet } = useSettings()

  /* if (window) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode

    }
  } */

  useEffect(() => {
    const wasEarly = Cookies.get('rvCount') ? parseInt(Cookies.get('rvCount'), 10) : 0
    Cookies.set('rvCount', wasEarly + 1, { expires: 365 })
    const savedRefId = store.getItem('Meteor.referralToken')
    if (!savedRefId) {
      const refId = getQueryParam(location.search, 'refId')
      if (refId) {
        store.setItem('Meteor.referralToken', refId)
      }
    }

    const loadReactGA = async () => {
      const importedModule = await import('react-ga')
      ReactGA = importedModule.default

      // Analitycs
      ReactGA.initialize('UA-64039800-1', {
        titleCase: false,
        gaOptions: {
          cookieDomain: 'auto',
          allowLinker: true,
          useAmpClientId: true
          // siteSpeedSampleRate: 100
        }
      })
      // ReactGA.plugin.require('linkid')
      ReactGA.plugin.require('displayfeatures')
      ReactGA.ga('require', 'linker')
      ReactGA.ga('linker:autoLink', ['ryfma.com'])
      setTimeout(() => {
        ReactGA.ga('send', 'event', 'read', '15_seconds')
      }, 15000)
    }

    if (typeof window !== 'undefined' && !ReactGA) {
      loadReactGA()
    }
  }, [])

  useEffect(() => {
    /* ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {
      ReactGA.timing({
        category: "Load Performace",
        variable: 'Time to Interactive',
        value: tti
      })
    }) */

    /* const callback = list => {
      list.getEntries().forEach(entry => {
        console.log(entry)
        ReactGA.timing({
          category: "First Meaningful Paint",
          variable: entry.name,
          value: entry.responseEnd
        })
      })
    }

    var observer = new PerformanceObserver(callback)
    observer.observe({
      entryTypes: [
        // 'navigation',
        // 'paint',
        // 'resource',
        // 'mark',
        // 'measure',
        // 'frame',
        // 'longtask'
      ]
    }) */

    /* history.listen((location) => {
      if(pathname.includes('/user')) {
        let rootURL = pathname.split('/')[1]
        let userPage = pathname.split('/')[3]

        let pageHit = `/${rootURL}/${userPage}`
        ReactGA.pageview(pageHit)
      } else {
        ReactGA.set({ page: pathname });
        ReactGA.pageview(pathname)
      }
    }) */

    const path = pathname
    // if (path.indexOf('/https://ryfma.com') > -1) {
    //  path = path.replace('/https://ryfma.com', '')
    // }

    // Yandex.Metrika
    // ym('hit', path)

    /* // Mail.ru
    const _tmr = window._tmr || (window._tmr = [])
    _tmr.push({ id: '3057164', type: 'pageView', url: pathname, start: (new Date()).getTime() })

    // Rambler
    if (window.top100Counter) {
      window.top100Counter.trackPageview()
    } */

    if (currUserId && typeof window !== 'undefined') {
      window.location.reload()
    }

    if (ReactGA) {
      ReactGA.set({
        page: path
      })
      ReactGA.pageview(path)
    } else {
      const loadReactGA = async () => {
        const importedModule = await import('react-ga')
        ReactGA = importedModule.default

        ReactGA.set({
          page: path
        })
        ReactGA.pageview(path)
      }

      if (typeof window !== 'undefined' && !ReactGA) {
        loadReactGA()
      }
    }
  }, [pathname])

  /* const cookieReadCookie = Cookies.get('readCookie')

  const hideCookies = () => {
    setReadCookie(1)
    Cookies.set('readCookie', 1, { expires: 365 })
  }

  
  const hideSignup = () => {
    // setSignupPopup(1)
    // Cookies.set('readSignUp', 1, { expires: 365 })
  }

  const renderCookieBar = () => {
    return (<div id='cookies-bar-id' className={'cookies-bar padding-bottom'}>
      <p>{t('common:cookies')}&nbsp;<Link to='/privacy' rel='noopener nofollow'>{t('common:learnMore')}</Link>.
      </p>
      <button type='button' className='cookies-bar-close' onClick={hideCookies} name='close'>
        <svg className='icon times' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'>
          <path d='M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z' />
        </svg>
      </button>
    </div>)
  }

  const renderSignupBar = () => {
    return (<div id='cookies-bar-id' className='cookies-bar signup-bar padding-bottom'>
      <p>{t('common:signupPopup')}&nbsp;<Link to='/register' rel='noopener nofollow'>{t('common:signup')}</Link>
      </p>
      {/* <button type='button' className='cookies-bar-close' onClick={hideSignup} name='close'>
        <svg className='icon times' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'>
          <path d='M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z' />
        </svg>
      </button>
    </div>)
  } */

  let HeaderComponent = null
  let FooterComponent = null
  let NavigationComponent = null

  const isAuthPages = useMemo(
    () => {return pathname.includes('/login') ||
      pathname.includes('/register') ||
      pathname.includes('/recover-password') ||
      pathname.includes('/r/') ||
      pathname.includes('/reset-password')
    }
    ,
    [pathname]
    )

  const editorPages = useMemo(
    () => {return pathname.includes('/new-album') ||
      pathname.includes('/new-book') ||
      pathname.includes('/new-chapter') ||
      pathname.includes('/new-post') ||
      pathname.includes('/new-contest') ||
      pathname.includes('/new-event') ||
      pathname.includes('/new-ask')
    }
    ,
    [pathname]
  )

  const hideNavigation = useMemo(
    () => {return isAuthPages ||
    editorPages ||
    (pathname.includes('/edit') && !pathname.includes('/memberships') && !pathname.includes('/u/edit')) ||
    pathname.includes('/email-verification') ||
    pathname.includes('/ch/') ||
    pathname.includes('/e/ticket')
  }
  ,
  [pathname]
  )

  if (!hideNavigation) {
    HeaderComponent = <Header />
    FooterComponent = <Footer />
  }

  if (!isTablet && !hideNavigation) {
    NavigationComponent = <MobileNavigation />
  }

  let innerClassName = 'inner-content'
  if (pathname.includes('/chats')) {
    if (pathname === '/me/chats') {
      innerClassName = 'inner-content rooms-main-content rooms-inner-content'
    } else {
      innerClassName = 'inner-content rooms-inner-content'
    }
  } else if (isAuthPages) {
    innerClassName = 'inner-content auth-pages'
  }
  if (editorPages) {
    innerClassName += ' editor-pages'
  }
  /* if (!hideNavigation || !readAnounce) {
    innerClassName += ' add-top-banner'
  }*/

  return (<div className={`ryfmaWeb ${rTheme} ${hideNavigation && !editorPages ? 'full-screen' : ''}`}>
    <ScrollToTop />

    {HeaderComponent}

    <NotificationContainer />

    <div className={innerClassName}>
      <Routes />
    </div>

    {FooterComponent}

    {NavigationComponent}

    {/* readCookie !== 1 && cookieReadCookie !== 1 && <NoIndex>{renderCookieBar()}</NoIndex>}
    {wasEarly > 0 && !hideNavigation && !(readCookie !== 1 && cookieReadCookie !== 1) && <NoIndex>{renderSignupBar()}</NoIndex> */}

    {/* <YMInitializer
      accounts={[31738176]}
      options={{
        defer: true,
        clickmap: false,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: false
      }}
      version='2' // Beta version
    /> */}
  </div>
  )
}

export default MainLayout
