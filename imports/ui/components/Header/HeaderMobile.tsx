import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Link, useHistory, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import Check from 'react-feather/dist/icons/check'
import { useSettings } from '/imports/hooks'
import RPopup from '/imports/ui/components/Common/Popup'

let TopBanner = () => null
let ReactGA = () => null

interface LangsArr {
  [key: string]: JSX.Element
}

function Header () {
  const [t, i18n] = useTranslation(['common', 'form'])
  const history = useHistory()
  const { pathname } = useLocation()
  const { rTheme, readAnounce, isMobile, isTablet, isAMP, setRTheme, setReadAnounce } = useSettings()
  const [showTopBanner, setShowTopBanner] = useState(false)
  
  useEffect(() => {
    import('react-ga').then(module => {
      ReactGA = module.default
    })
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
      label: `ThemeChanged: ${newTheme}, ${'anon'}`,
      value: 1
    })
    Cookies.set('rTheme', newTheme, { expires: 365 })
    Cookies.set('rThemeLast', newTheme, { expires: 365 })
    setRTheme(newTheme)
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

  if (pathname === '/' ||
    pathname === '/f/all' ||
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
      <Link to={'/login'} target="_blank">
        <Check />
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

  return (<>
    {isShowBanner && <TopBanner />}
    <div id='top-header' className={headerClassName} itemScope itemType='http://www.schema.org/SiteNavigationElement'>
      <div className='header-block'>
        {!isAMP && <div key='lang' className='item lang'>
          <RPopup
            className='language-popup'
            trigger={<div className='language-toggle'>
              {langFlags[currLang] || langFlags.en}
            </div>}
            content={languages}
            position='bottom left'
          />
        </div>}
        {!isAMP && <div key='theme' className='item theme'>
          <RPopup
            className='readability-popup'
            trigger={<div className='readability-mode'><i aria-hidden='true' className='icon large moon' /></div>}
            content={readability}
          />
        </div>}
      </div>
      <div key='logo' className='header-block header item' itemProp='name'>
        <NavLink to='/' className='logo' itemProp='url' title='На главную' aria-label='На главную'>
          <span>Ryfma</span>
        </NavLink>
      </div>
      <nav key='drop-menu' className={isAMP ? 'right menu header-block menu-item amp-header' : 'right menu header-block menu-item'}>
        {!isAMP && <RPopup
          className='menu-popup'
          trigger={<div className='menu-toggle'><i aria-hidden='true' className='icon large align-left' /></div>}
          content={menu}
          position='bottom right'
        />}
      </nav>
    </div>
  </>)
}

export default Header
