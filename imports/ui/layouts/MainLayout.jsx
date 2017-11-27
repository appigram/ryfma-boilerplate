import React, { Component } from 'react'
import ScrollTop from '../components/Common/ScrollTop'
import ScrollToTop from '../components/Common/ScrollToTop'

import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import MobileNavigation from '../components/Header/MobileNavigation'
import NotificationContainer from '../components/Notification/Notification'

import withTracker from '/imports/ui/containers/withTracker'

class MainLayout extends Component {
  render () {
    const { locationObj, isMobile, isTablet, authenticated, children } = this.props

    const pathname = typeof window !== 'undefined' ? window.location.pathname : locationObj.pathname

    const hideScrollTop = pathname.includes('/register') ||
      pathname.includes('/recover-password') ||
      pathname.includes('/reset-password') ||
      pathname.includes('/email-verification')

    const hideNavigation = pathname.includes('/login') ||
      pathname.includes('/register') ||
      pathname.includes('/recover-password') ||
      pathname.includes('/reset-password') ||
      pathname.includes('/new-post') ||
      pathname.includes('/edit') ||
      pathname.includes('/email-verification')

    let HeaderComponent = null
    let FooterComponent = null
    let NavigationComponent = null
    let ScrollTopComponent = null

    if (isMobile && !isTablet) {
      NavigationComponent = <MobileNavigation pathname={pathname} authenticated={authenticated} />
    }

    if (!hideNavigation) {
      HeaderComponent = <Header pathname={pathname} isMobile={isMobile} isTablet={isTablet} authenticated={authenticated} />
      FooterComponent = <Footer pathname={pathname} isMobile={isMobile} />
    }

    if (!isMobile && !isTablet && !hideScrollTop) {
      ScrollTopComponent = <ScrollTop />
    }

    return (<div className={`ryfmaWeb`}>
      <ScrollToTop />

      {HeaderComponent}

      <NotificationContainer />

      <div className='inner-content'>{children}</div>

      {ScrollTopComponent}

      {FooterComponent}

      {NavigationComponent}

    </div>
    )
  }
}

export default withTracker(MainLayout)
