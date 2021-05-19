import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Link, useHistory, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import Check from 'react-feather/dist/icons/check'
import PlusCircle from 'react-feather/dist/icons/plus-circle'
import { useSettings } from '/imports/hooks'
// import { Popup } from 'semantic-ui-react'
import RPopup from '/imports/ui/components/Common/Popup'

interface LangsArr {
  [key: string]: JSX.Element
}

let TopBanner = () => null
let SearchInput = () => null
let ReactGA = () => null

function Header () {
  const [t, i18n] = useTranslation(['common', 'form'])
  const history = useHistory()
  const { pathname } = useLocation()
  const { rTheme, readAnounce, isAMP, setRTheme } = useSettings()
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [showTopBanner, setShowTopBanner] = useState(false)

  const referer = pathname !== '/' ? pathname : null

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
    if (lang !== 'ru') {
      i18n.changeLanguage(lang)
      history.push(pathname + '?hl=' + lang)
    } else if (i18n.language !== 'ru' && lang === 'ru') {
      i18n.changeLanguage(lang)
      history.push({ pathname, query: '' })
    }
    ReactGA.event({
      category: 'User',
      action: 'ChangeLanguage',
      label: `ChangeLanguage: from: ${i18n.language} to ${lang}`,
      value: 1
    })
  }

  const changeTheme = (newTheme: string) => (e) => {
    Cookies.set('rTheme', newTheme, { expires: 365 })
    Cookies.set('rThemeLast', newTheme, { expires: 365 })
    setRTheme(newTheme)
    ReactGA.event({
      category: 'User',
      action: 'ThemeChanged',
      label: `ThemeChanged: ${newTheme}, ${'anon'}`,
      value: 1
    })
  }

  const startWritingNewPost = () => {
    ReactGA.event({
      category: 'User',
      action: 'PostStartWritingNotLogged',
      label: `PostStartWritingNotLogged`,
      value: 1
    })
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

  const handleShowSearchInput = async () => {
    const module = await import('../Search/SearchInput')
    SearchInput = module.default
    setShowSearchInput(!showSearchInput)
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
      <div key='logo' className='header-block header item' itemProp='name'>
        {!isAMP ?
          <NavLink to='/' className='logo' itemProp='url' title='На главную' aria-label='На главную'>
            <img src='https://cdn.ryfma.com/defaults/icons/favicon-96x96.png' className='logoImg' alt='Ryfma logo' width='32' height='32' />
            {/* <img src='https://cdn.ryfma.com/defaults/icons/favicon-winter-96x96-min.png' className='logoImg' alt='Ryfma logo' width='32' height='32' /> */}
            <span>Ryfma</span>
          </NavLink>
          : <>
          <a href='/' className='logo' itemProp='url' title='На главную' aria-label='На главную' style={{ position: 'relative', width: '32px', height: '32px'}} target='_blank'>
            <img src='https://cdn.ryfma.com/defaults/icons/favicon-96x96.png' className='logoImg' alt='Ryfma logo' width='32' height='32' />
            {/* !(isTablet || isMobile) && <img src='https://cdn.ryfma.com/defaults/icons/favicon-winter-96x96-min.png' className='logoImg' alt='Ryfma logo' /> */}
          </a>
          <span style={{ fontSize: '1.3rem'}}>Ryfma</span>
          </>
        }
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
      <div key='fairytails' className='item'>
        <NavLink className='top-menu-link' to='/fairytails' itemProp='url' title={t('common:header.fairytails')} aria-label={t('common:header.fairytails')}>
          {t('common:header.fairytails')}
        </NavLink>
      </div>
      {!isAMP && <RPopup
        className='dropdown extra-menu'
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
      />}
      <div className='right menu header-block'>
        {!isAMP && <div key='lang' className='item lang'>
          <RPopup
            className='language-popup'
            trigger={<div className='language-toggle'>
              {langFlags[currLang]}
            </div>}
            content={languages}
            position='bottom left'
            minWidth='4rem'
          />
        </div>}
        {!isAMP && <div key='theme' className='item theme'>
          <RPopup
            className='readability-popup'
            trigger={<div className='readability-mode'><i aria-hidden='true' className='icon large moon' /></div>}
            content={readability}
            minWidth='13rem'
          />
        </div>}
        {!isAMP && <div key='search' className='item'>
          {showSearchInput ?
            <SearchInput handleShowSearchInput={handleShowSearchInput} />
            :
            <button onClick={handleShowSearchInput} className='search-button'>
              <i className='ui icon search'  />
            </button>
          }
        </div>}
        <div key='user' className='item right'>
          <Link to='/new-post' className='new-post-button button unlogged' onClick={startWritingNewPost} title={t('common:header.addPost')}>
            <PlusCircle />
          </Link>

          <Link
            to={referer ? `/login?referer=${referer}` : '/login'}
            className='ui primary button login-button'
            itemProp='url'
            title={t('form:login')}
            aria-label={t('form:login')}
          >
            {t('form:login')}
          </Link>
        </div>
      </div>
    </div>
  </>)
}

export default Header
