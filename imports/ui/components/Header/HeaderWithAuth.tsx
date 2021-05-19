import { Meteor } from 'meteor/meteor'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Link, useHistory, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import Bell from 'react-feather/dist/icons/bell'
import Check from 'react-feather/dist/icons/check'
import X from 'react-feather/dist/icons/x'
import { useAuth, useSettings } from '/imports/hooks'
import { Popup } from 'semantic-ui-react'
import { Notification } from '/imports/ui/components/Notification/Notification'
import AuthMenu from './AuthMenu'
import ReactGA from 'react-ga'


interface LangsArr {
  [key: string]: JSX.Element
}

let TopBanner = () => null
let SearchInput = () => null

function HeaderWithAuth () {
  const [t, i18n] = useTranslation()
  const history = useHistory()
  const { pathname } = useLocation()
  const { currUser, currUserId } = useAuth()
  const { rTheme, readAnounce, readWebPush, readCookie, setRTheme, setReadWebPush } = useSettings()
  const [showSearchInput, setShowSearchInput] = useState(false)
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
              guid: generateBrowserFingerprint(),
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


  const handleShowSearchInput = async () => {
    const module = await import('../Search/SearchInput')
    SearchInput = module.default
    setShowSearchInput(!showSearchInput)
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
        <i aria-hidden='true' className='icon book' />
        {t('bookTheme')}
        {/* !isPremium && <Link to='/upgrade' className='ui label pro-badge'>PRO</Link> */}
      </a>
    </div>
    <div className='auto-change-theme'>
      <Link to={'/me/account#extraSettings'} target="_blank">
        {currUser ? (currUser.settings.autoTheme === false ? <Check size={16} /> : <X size={16} />) : null}
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
      <div key='logo' className='header-block header item' itemProp='name'>
        <NavLink to='/' className='logo' itemProp='url' title='На главную' aria-label='На главную'>
          <img src='https://cdn.ryfma.com/defaults/icons/favicon-96x96.png' className='logoImg' alt='Ryfma logo' width='32' height='32' />
          {/* <img src='https://cdn.ryfma.com/defaults/icons/favicon-winter-96x96-min.png' className='logoImg' alt='Ryfma logo' width='32' height='32' />*/}
          <span>Ryfma</span>
          {/* <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 200 200'>
          <circle fill='#00a9ff' cx='100' cy='100' r='100' />
          <path fill='#FFFFFF' d='M96.868,122.99c-5.676,3.584-18.784,6.34-26.35,7.963c-2.908,0.618-5.927,4.928-7.453,7.166c-4.445,6.519-8.911,14.968-15.672,27.017C67.956,95.37,98.444,54.943,152.606,34.865c-0.754,6.387-4.822,21.792-11.493,23.676c-5.616,1.586-22.359,3.666-28.074,5.435c7.582,0.426,17.788,1.348,27.078,1.666c-5.626,12.005-17.675,34.321-39.158,51.674c-4.547,1.042-14.31,1.989-20.237,2.141C80.707,119.683,84.378,120.286,96.868,122.99z' />
        </svg>}
        <span>Ryfma</span> */}
        </NavLink>
      </div>
      <div key='books' className='item'>
        <NavLink className={pathname.indexOf('/books') > -1 ? 'top-menu-link active' : 'top-menu-link'} to='/books/all' itemProp='url' title={t('common:header.books')} aria-label={t('common:header.books')}>
          {t('common:header.books')}
          <i className='live-dot' />
        </NavLink>
      </div>
      <div key='classic' className='item'>
        <NavLink className='top-menu-link' itemProp='url' to='/classic' title={t('common:header.classic')} aria-label={t('common:header.classic')}>
          {t('common:header.classic')}
        </NavLink>
      </div>
      <div key='contests' className='item'>
        <NavLink className='top-menu-link' to='/f/all' itemProp='url' title={t('common:header.contests')} aria-label={t('common:header.contests')}>
          {t('common:header.contests')}
        </NavLink>
      </div>
      {/* !isTablet && !isMobile && <div key='events' className='item'>
        <NavLink className='top-menu-link' to='/e/all' itemProp='url' title={t('common:header.events')} aria-label={t('common:header.events')}>
          {t('common:header.events')}
        </NavLink>
      </div> */}
      <Popup
        className='dropdown item extra-menu'
        on='click'
        position='bottom center'
        hideOnScroll
        trigger={<div role="listbox" aria-expanded="false" className="ui dropdown item" tabIndex={0}>
          <span className='top-menu-link' aria-label={t('common:header.more')}>
            <svg width='20' height='4' viewBox='0 0 20 4' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M2 4A2 2 0 1 0 2.001.001 2 2 0 0 0 2 4zm8 0a2 2 0 1 0 .001-3.999A2 2 0 0 0 10 4zm8 0a2 2 0 1 0 .001-3.999A2 2 0 0 0 18 4z'
                fill='#222'
                fillRule='evenodd'
              />
            </svg>
          </span>
        </div>
        }
        content={<div className='services-menu'>
          <div role="option" className='item error'>
            <Link to='/upgrade' title={t('common:header.upgrade')} aria-label={t('common:header.upgrade')}>
              <i aria-hidden='true' className='icon star' />{t('common:header.upgrade')}
            </Link>
          </div>
          {currLang === 'ru' && <div role="option" className="item">
            <Link to='/sponsors' title='#ПишиДома' aria-label='#ПишиДома'>
              <i aria-hidden='true' className='icon chess home' />#ПишиДома
            </Link>
          </div>}
          <div role="option" className='item'>
            <Link className='top-menu-link' to='/fairytails' itemProp='url' title={t('common:header.fairytails')} aria-label={t('common:header.fairytails')}>
            <i aria-hidden='true' className='icon magic' /> {t('common:header.fairytails')}
            </Link>
          </div>
          <div role="option" className="item">
            <Link to='/d/all' title={t('common:header.duels')} aria-label={t('common:header.duels')}>
              <i aria-hidden='true' className='icon chess queen' />{t('common:header.duels')}
            </Link>
          </div>
          <div role="option" className="item">
            <Link to='/ask/all' title={t('common:header.asks')} aria-label={t('common:header.asks')}>
              <i aria-hidden='true' className='icon question' />{t('common:header.asks')}
            </Link>
          </div>
          <div role="option" className="item">
            <Link to='/rhyme' title={t('common:header.rhymes')} aria-label={t('common:header.rhymes')}>
              <i aria-hidden='true' className='icon pen' />{t('common:header.rhymes')}
            </Link>
          </div>
        </div>}
      />
      <div className='right menu header-block'>
        <div key='lang' className='item lang'>
          <Popup
            className='language-popup'
            trigger={<div className='language-toggle'>
              {langFlags[currLang]}
            </div>}
            content={languages}
            on='click'
            position='bottom center'
            hideOnScroll
          />
        </div>
        <div key='theme' className='item theme'>
          <Popup
            className='readability-popup'
            trigger={<div className='readability-mode'><i aria-hidden='true' className='icon large moon' /></div>}
            content={readability}
            on='click'
            position='bottom center'
            hideOnScroll
          />
        </div>
        <div key='search' className='item search'>
          {showSearchInput ?
            <SearchInput handleShowSearchInput={handleShowSearchInput} />
            :
            <button onClick={handleShowSearchInput} className='search-button'>
              <i className='ui icon search'  />
            </button>
          }
        </div>

        <div key='user' className='item right'>
          {currUser && currUserId && <AuthMenu currUser={currUser} />}
        </div>
      </div>
    </div>
  </>)
}

export default HeaderWithAuth
