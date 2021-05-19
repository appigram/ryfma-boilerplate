import React, { useEffect, useMemo } from 'react'
import ym, { YMInitializer } from '@appigram/react-yandex-metrika'

import { useLocation } from 'react-router-dom'
import { useSettings, useAuth } from '/imports/hooks'

// Analitycs
// import ttiPolyfill from 'tti-polyfill'
import ReactGA from 'react-ga'

import ScrollToTop from '/imports/ui/components/Common/ScrollToTop'

import Header from '/imports/ui/components/Header/HeaderMobileWithAuth'
import Footer from '/imports/ui/components/Footer/Footer'
import MobileNavigation from '/imports/ui/components/Header/MobileNavigationWithAuth'
import NotificationContainer from '/imports/ui/components/Notification/Notification'

let VerifyEmail = null

function MainLayout ({ Routes }) {
  const { pathname } = useLocation()
  const { currUser, currUserId } = useAuth()
  const { rTheme, isTablet } = useSettings()

  /* if (window) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode

    }
  } */

  useEffect(() => {
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
    ReactGA.plugin.require('displayfeatures')
    ReactGA.plugin.require('linkid')
    ReactGA.ga('require', 'linker')
    ReactGA.ga('linker:autoLink', ['ryfma.com'])
    setTimeout(() => {
      ReactGA.ga('send', 'event', 'read', '15_seconds')
    }, 15000)

    if (currUserId) ReactGA.set({ userId: currUserId })

    let verifyEmail = true
    if (currUser && currUser.emails && currUser.emails[0] && currUser.emails[0].address && currUser.emails[0].verified) {
      verifyEmail = false
    }

    if (verifyEmail) {
      import('/imports/ui/components/Common/VerifyEmail').then(module => {
        VerifyEmail = module.default
      })
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

    ReactGA.set({
      page: path
    })
    ReactGA.pageview(path)

    // Yandex.Metrika
    ym('hit', path)

    /* // Mail.ru
    const _tmr = window._tmr || (window._tmr = [])
    _tmr.push({ id: '3057164', type: 'pageView', url: pathname, start: (new Date()).getTime() })

    // Rambler
    if (window.top100Counter) {
      window.top100Counter.trackPageview()
    } */

    if (!currUserId && typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [pathname])

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
    pathname.includes('/e/ticket') ||
    pathname.includes('/me/chats')
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

  return (<div className={`ryfmaWeb ${rTheme} ${hideNavigation && !editorPages ? 'full-screen' : ''}`}>
    <ScrollToTop />

    {HeaderComponent}

    {!hideNavigation && VerifyEmail && <VerifyEmail currEmail={currUser && currUser.emails && currUser.emails[0]} />}

    <NotificationContainer />

    <div className={innerClassName}>
      <Routes />
    </div>

    {FooterComponent}

    {NavigationComponent}

    <YMInitializer
      accounts={[31738176]}
      options={{
        defer: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      }}
      version='2' // Beta version
    />
  </div>
  )
}

export default MainLayout
