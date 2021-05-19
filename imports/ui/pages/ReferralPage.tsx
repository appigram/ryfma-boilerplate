import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import SEO from '/imports/ui/components/Common/SEO'
import store from '/lib/store'
import loginScreens from '/lib/utils/helpers/loginScreens'
import ReactGA from 'react-ga'

function ReferralPage() {
  const [t] = useTranslation('referral')
  const { referralId } = useParams()
  const [randomScreen, setRandomScreen] = useState(loginScreens[0])

  useEffect(() => {
    setRandomScreen(loginScreens[Math.floor(Math.random() * Math.floor(7))])
    ReactGA.event({
      category: 'User',
      action: 'RefferalNew',
      label: `RefferalNew: ${referralId}`,
      value: 1
    })
    store.setItem('Meteor.referralToken', referralId)
  }, [])

  return (<div className='auth-page'>
    <SEO
      schema='Webpage'
      title={t('seoTitle')}
      description={t('seoDesc')}
      path={`/r/${referralId}`}
      contentType='product'
      noIndex={true}
      noFollow={true}
    />
    <section key='login-screen' className="auth-sidebar" style={{ background: randomScreen.backgroundColor }}>
      <div className="auth-sidebar-content">
        <header>
          <Link to='/' className='logo'>
            <img src="https://cdn.ryfma.com/defaults/icons/favicon-96x96.png" className="logoImg" alt="Ryfma logo" />
            <span>Ryfma</span>
          </Link>
          <h1 key='login-title'>{randomScreen.title}</h1>
        </header>
        <div className="screen">
          <div key='login-img' style={{ backgroundImage: `url(${randomScreen.image})` }} className="screen-img" />
          <p className="screen-attribution">
            {t('learnMoreOn')}{randomScreen.url && <Link key='login-url' to={randomScreen.url} className="url" target="_blank">{randomScreen.shortTitle}</Link>}
          </p>
        </div>
      </div>
    </section>
    <div className='content'>
      <div className='inner-content'>
        <div className='auth-content'>
          <h2 style={{ fontSize: '2em' }}>{t('header')}</h2>
          <p>{t('subheader')}</p>
          <Link className='ui button blue' to='/register'>{t('letsStart')}</Link>
        </div>
      </div>
    </div>
  </div>)
}

export default ReferralPage
