import { Meteor } from 'meteor/meteor'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Link, useHistory, useLocation } from 'react-router-dom'
// import { Menu, Popup, Icon } from 'antd/es'
import Cookies from 'js-cookie'
import Bell from 'react-feather/dist/icons/bell'
import Check from 'react-feather/dist/icons/check'
import X from 'react-feather/dist/icons/x'
import { useAuth, useSettings } from '/imports/hooks'
import { Popup } from 'semantic-ui-react'
import { Notification } from '/imports/ui/components/Notification/Notification'
import ReactGA from 'react-ga'

let TopBanner = () => null

interface LangsArr {
  [key: string]: JSX.Element
}

function HeaderWithAuth () {
  const [t, i18n] = useTranslation()
  const history = useHistory()
  const { pathname } = useLocation()
  const { currUser, currUserId } = useAuth()
  const { rTheme, readAnounce, readWebPush, readCookie, isMobile, isTablet, setRTheme, setReadWebPush } = useSettings()

  const [showTopBanner, setShowTopBanner] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const notifSupported = 'Notification' in window && 'PushManager' in window
      if (notifSupported && readCookie) {
        handleWebPushSubscribe() // TODO: disable later
      }
    }
  }, [])

  useEffect(() => {
    if (!readAnounce) {
      import('/imports/ui/components/Header/TopBanner').then(module => {
        TopBanner = module.default
        setShowTopBanner(true)
      })
    }
  }, [readAnounce])

  const changeLanguage = (lang: string) => (e) => {
    ReactGA.event({
      category: 'User',
      action: 'ChangeLanguage',
      label: `ChangeLanguage: from: ${i18n.language} to ${lang}`,
      value: 1
    })
    if (lang !== 'ru') {
      i18n.changeLanguage(lang)
      history.push(pathname + '?hl=' + lang)
    } else if (i18n.language !== 'ru' && lang === 'ru') {
      i18n.changeLanguage(lang)
      history.push({ pathname, query: '' })
    }
  }

  const changeTheme = (newTheme: string) => (e) => {
    ReactGA.event({
      category: 'User',
      action: 'ThemeChanged',
      label: `ThemeChanged: ${newTheme}, ${currUserId}`,
      value: 1
    })
    Cookies.set('rTheme', newTheme, { expires: 365 })
    Cookies.set('rThemeLast', newTheme, { expires: 365 })
    setRTheme(newTheme)
   }

  // Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const handleWebPushSubscribe = async () => {
    const vapidKey = Meteor.settings.public.vapid.publicKey
    let registration = null
    if (typeof navigator.serviceWorker !== "undefined") {
      try {
        registration = await navigator.serviceWorker.ready
        if (!registration.pushManager) {
          Notification.error('Web Push Unsupported')
          ReactGA.event({
            category: 'User',
            action: 'WebPushUnsupported',
            label: `NoWebPush: ${currUserId}, browser: ${navigator.userAgent || navigator.vendor || window.opera}`,
            value: 1
          })
          setReadWebPush(2)
          Cookies.set('webPushSubscribed', 2, { expires: 30 })
          return
        }
      } catch (err) {
        console.log(err)
      }

      let subscription = null
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        })
      } catch (err) {
        console.log(err)
      }

      if (subscription) {
        try {
          const module = await import('/lib/utils/helpers/generateBrowserFingerprint')
          const generateBrowserFingerprint = module.default
          await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              _id: currUserId,
              guid: generateBrowserFingerprint(isMobile, isTablet),
              type: 1,
              subscription
            })
          })
          setReadWebPush(2)
          Cookies.set('webPushSubscribed', 2, { expires: 365 })
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  /* unsubscribePush = () => {
    navigator.serviceWorker.ready.then(registration => {
      //Find the registered push subscription in the service worker
      registration.pushManager
        .getSubscription()
        .then(subscription => {
          if (!subscription) {
            return
            //If there isn't a subscription, then there's nothing to do
          }
        `
          subscription
            .unsubscribe()
            .then(() => axios.delete("/push/unregister"))
            .catch(err => console.error(err))
        })
        .catch((err) => console.error(err))
    })
  } */

  const hideWebPushSubsribe = () => {
    setReadWebPush(2)
    Cookies.set('webPushSubscribed', 2, { expires: 30 })
  }

  const currLang: string = i18n.language ? i18n.language.substring(0, 2) : 'ru'
  const languages  = (<ul className='languages'>
    <li className={currLang === 'ru' ? 'hidden' : ''} onClick={changeLanguage('ru')}>
      Русский
    </li>
    <li className={currLang === 'en' ? 'hidden' : ''} onClick={changeLanguage('en')}>
      English
    </li>
    {/* <li className={currLang === 'es' ? 'hidden' : ''} onClick={changeLanguage('es')}>
      {langFlags['es']}
      Español
    </li>
    <li className={currLang === 'de' ? 'hidden' : ''} onClick={changeLanguage('de')}>
      {langFlags.de}
      Deutsch
    </li>
    <li className={currLang === 'fr' ? 'hidden' : ''} onClick={changeLanguage('fr')}>
      {langFlags.fr}
      Français
    </li>
    <li className={currLang === 'it' ? 'hidden' : ''} onClick={changeLanguage('it')}>
      {langFlags.it}
      Italiano
    </li> */}
  </ul>)

  let headerClassName = 'ui top-header clearfix secondary menu'
  const menu = <ul className='menu-list'>
    {currLang === 'ru' && <li key={0}><Link to='/sponsors' title='Спонсоры' aria-label='Спонсоры' style={{ color: '#ee2463' }}><i aria-hidden='true' className='icon house-user' />#ПишиДома</Link></li>}
    <li key={2}><Link to='/fairytails' title={t('common:header.fairytails')} aria-label={t('common:header.fairytails')}><i aria-hidden='true' className='icon hat-wizard' />{t('common:header.fairytails')}</Link></li>
    <li key={3}><Link to='/f/all' title={t('common:header.contests')} aria-label={t('common:header.contests')}><i aria-hidden='true' className='icon trophy' />{t('common:header.contests')}</Link></li>
    <li key={4}><Link to='/classic' title={t('common:header.classic')} aria-label={t('common:header.classic')}><i aria-hidden='true' className='icon graduation-cap' />{t('common:header.classic')}</Link></li>
    <li key={5}><Link to='/e/all' title={t('common:header.events')} aria-label={t('common:header.events')}><i aria-hidden='true' className='icon microphone' />{t('common:header.events')}</Link></li>
    <li key={6}><Link to='/d/all' title={t('common:header.duels')} aria-label={t('common:header.duels')}><i aria-hidden='true' className='icon chess queen' />{t('common:header.duels')}</Link></li>
    <li key={7}><Link to='/ask/all' title={t('common:header.asks')} aria-label={t('common:header.asks')}><i aria-hidden='true' className='icon comments outline' />{t('common:header.asks')}</Link></li>
    <li key={8}><Link to='/rhyme' title={t('common:header.rhymes')} aria-label={t('common:header.rhymes')}><i aria-hidden='true' className='icon pen' />{t('common:header.rhymes')}</Link></li>
    {/* <li><Link to='/levitan' title='' aria-label={t('common:header.levitan')}><i aria-hidden='true' className='icon image' />{t('common:header.levitan')}</Link></li> */}
  </ul>

  if (isMobile) {
    headerClassName = 'ui top-mobile-header clearfix secondary menu'
  }

  if (isTablet) {
    headerClassName = 'ui top-header tablet-header clearfix secondary menu'
  }

  if (pathname === '/f/all' ||
    pathname === '/d/all' ||
    pathname === '/e/all' ||
    pathname === '/ask/all' ||
    pathname === '/books/all' ||
    pathname === '/fairytails' ||
    pathname === '/classic' ||
    pathname === '/upgrade' ||
    pathname === '/rhyme' ||
    pathname === '/cover-design' ||
    pathname === '/sponsors'
  ) {
    headerClassName = headerClassName + ' transparent'
  }

  if (pathname === '/upgrade') {
    headerClassName = headerClassName + ' upgrade'
  }

  const readability = (<div className='readability'>
    <div className='header'>{t('chooseTheme')}</div>
    <div className='themes'>
      <a className={rTheme === 'sun' ? 'active' : ''} onClick={changeTheme('sun')} title='' aria-label='Светлая тема'>
        <i aria-hidden='true' className='icon sun' />
        {t('lightTheme')}
      </a>
      <a className={rTheme === 'moon' ? 'active' : ''} onClick={changeTheme('moon')} title='' aria-label='Темная тема'>
        <i aria-hidden='true' className='icon moon' />
        {t('darkTheme')}
      </a>
      <a className={rTheme === 'idea' ? 'active' : ''} onClick={changeTheme('idea')} title='' aria-label='Книжная тема'>
        <i aria-hidden='true' className='icon idea' />
        {t('bookTheme')}
        {/* !isPremium && <Link to='/upgrade' className='ui label pro-badge'>PRO</Link> */}
      </a>
    </div>
    <div className='auto-change-theme'>
      <Link to={'/me/account#extraSettings'} target="_blank">
        {currUser && currUser.settings.autoTheme === false ? <Check size={16} /> : <X size={16} />}
        {t('autoChangeTheme')}
        </Link>
    </div>
  </div>)

  const langFlags: LangsArr = {
    ru: 'Рус', //<img className='country-icon' src='https://cdn.ryfma.com/defaults/flags/ru.svg' alt='Ru' />,
    en: 'Eng' //<img className='country-icon' src='https://cdn.ryfma.com/defaults/flags/us.svg' alt='En' />,
    // es: <img className='country-icon' src='https://cdn.ryfma.com/defaults/flags/es.svg' alt='Es' />,
    // de: <img className='country-icon' src='https://cdn.ryfma.com/defaults/flags/de.svg' alt='De' />,
    // fr: <img className='country-icon' src='https://cdn.ryfma.com/defaults/flags/fr.svg' alt='Fr' />,
    // it: <img className='country-icon' src='https://cdn.ryfma.com/defaults/flags/it.svg' alt='It' />
  }

  const isShowBanner = !readAnounce
  const notifsSupported = typeof window !== 'undefined' ? 'Notification' in window && 'PushManager' in window : false
  const isShowPushBanner = notifsSupported && readWebPush !== 2

  return (<>
    {isShowBanner && <TopBanner />}
    {isShowPushBanner && <aside className='announcement-banner web-push-subscribe'>
      <div className='banner-content'>
        <Bell size={12} />
        {t('common:enableWebPush')}
        <button onClick={handleWebPushSubscribe}>{t('common:enableWebPushButton')}</button>
      </div>
      <button className='banner-close-button' type='button' onClick={hideWebPushSubsribe}>
        <svg className='icon times' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'>
          <title>Close Banner</title>
          <path d='M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z' />
        </svg>
      </button>
    </aside>}
    <div id='top-header' className={headerClassName} itemScope itemType='http://www.schema.org/SiteNavigationElement'>
      <div className='header-block'>
        <div key='lang' className='item lang'>
          <Popup
            className='language-popup'
            trigger={<div className='language-toggle'>
              {langFlags[currLang] || langFlags.en}
            </div>}
            content={languages}
            on='click'
            position='bottom right'
            hideOnScroll
          />
        </div>
        <div key='theme' className='item theme'>
          <Popup
            className='readability-popup'
            trigger={<div className='readability-mode'><i aria-hidden='true' className='icon large moon' /></div>}
            content={readability}
            on='click'
            position='bottom right'
            hideOnScroll
          />
        </div>
      </div>
      <div key='logo' className='header-block header item' itemProp='name'>
        <NavLink to='/' className='logo' itemProp='url' title='На главную' aria-label='На главную'>
          <span>Ryfma</span>
        </NavLink>
      </div>
      <nav key='drop-menu' className='right menu header-block menu-item'>
        <Popup
          className='menu-popup'
          trigger={<div className='menu-toggle'><i aria-hidden='true' className='icon large align-left' /></div>}
          content={menu}
          position='bottom right'
          on='click'
          hideOnScroll
        />
      </nav>
    </div>
  </>)
}

export default HeaderWithAuth
