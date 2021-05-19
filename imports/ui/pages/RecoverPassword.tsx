import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Header, Form, Button, Input } from 'semantic-ui-react'
// import ArrowLeft from 'react-feather/dist/icons/arrow-left'
import { Notification } from '/imports/ui/components/Notification/Notification'
import Accounts from '/imports/shared/meteor-react-apollo-accounts'
import SEO from '/imports/ui/components/Common/SEO'
import ReactGA from 'react-ga'
import loginScreens from '/lib/utils/helpers/loginScreens'
import { useSettings } from '/imports/hooks'

function RecoverPassword() {
  const [t] = useTranslation(['recover', 'form'])
  const { token } = useParams()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const { isMobile } = useSettings()
  const [randomScreen, setRandomScreen] = useState(loginScreens[0])

  useEffect(() => {
    setRandomScreen(loginScreens[Math.floor(Math.random() * Math.floor(7))])
  }, [])

  const reset = async (event) => {
    event.preventDefault()

    if (newPassword === repeatPassword) {
      try {
        await Accounts.resetPassword({ newPassword, token })
        Notification.success('Password changed!')
        ReactGA.event({
          category: 'User',
          action: 'ResetPassword',
          label: 'ResetPassword',
          value: 1
        })
        history.push('/')
      } catch (error) {
        Notification.error(error)
        // history.push('/recover-password');
      }
    } else {
      Notification.error('Passwords do not match.')
    }
  }

  const forgot = async (event) => {
    event.preventDefault()

    try {
      await Accounts.forgotPassword({ email })
      ReactGA.event({
        category: 'User',
        action: 'ForgotPassword',
        label: 'ForgotPassword',
        value: 1
      })
      Notification.success('Email sent!')
    } catch (error) {
      Notification.error(error)
    }
  }

  return token
    ? (
      <div className='auth-page'>
        <SEO
          schema='Webpage'
          title={t('seoResetTitle')}
          description={t('seoResetDesc')}
          path='recover-password'
          contentType='product'
          noIndex={true}
          noFollow={true}
        />
        <section className="auth-sidebar" style={{ background: randomScreen.backgroundColor }}>
          <div className="auth-sidebar-content">
            <header>
              <Link to='/' className='logo'>
                <img src="https://cdn.ryfma.com/defaults/icons/favicon-96x96.png" className="logoImg" alt="Ryfma logo" />
                <span>Ryfma</span>
              </Link>
              <h1>{randomScreen.title}</h1>
            </header>
            <div className="screen">
              <div style={{ backgroundImage: `url(${randomScreen.image})` }} className="screen-img" />
              <p className="screen-attribution">
                {t('learnMoreOn')}{randomScreen.url && <Link to={randomScreen.url} className="url" target="_blank">{randomScreen.shortTitle}</Link>}
              </p>
            </div>
          </div>
        </section>
        <div className='content'>
          <div className='inner-content'>
            <div className='auth-content'>
              {!isMobile && <h1>{t('headerReset')}</h1>}
              <Header.Subheader>
                {t('subheaderReset')}
              </Header.Subheader>
              <br />
              <Form onSubmit={reset}>
                <Form.Field>
                  <input
                    name='newPassword'
                    placeholder={t('form:newPassword')}
                    type='password'
                    required
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                </Form.Field>
                <Form.Field>
                  <input
                    name='repeatPassword'
                    placeholder={t('form:confirmPassword')}
                    type='password'
                    required
                    value={repeatPassword}
                    onChange={(event) => setRepeatPassword(event.target.value)}
                  />
                </Form.Field>
                <Button type='submit' color='blue' className='fullwidth-button'>{t('form:savePassword')}</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
    : (
      <div className='auth-page'>
        <SEO
          schema='Webpage'
          title={t('seoResetTitle')}
          description={t('seoResetDesc')}
          path='recover-password'
          contentType='product'
          noIndex={true}
          noFollow={true}
        />
        <section className="auth-sidebar" style={{ background: randomScreen.backgroundColor }}>
          <div className="auth-sidebar-content">
            <header>
              <Link to='/' className='logo'>
                <img src="https://cdn.ryfma.com/defaults/icons/favicon-96x96.png" className="logoImg" alt="Ryfma logo" />
                <span>Ryfma</span>
              </Link>
              <h1>{randomScreen.title}</h1>
            </header>
            <div className="screen">
              <div style={{ backgroundImage: `url(${randomScreen.image})` }} className="screen-img" />
              <p className="screen-attribution">
                {t('learnMoreOn')}<Link to={randomScreen.url} className="url" target="_blank">{randomScreen.shortTitle}</Link>
              </p>
            </div>
          </div>
        </section>
        <div className='content'>
          <div className='inner-content'>
            <div className='auth-content'>
              {!isMobile && <h1>{t('headerRecover')}</h1>}
              <Header.Subheader>
                {t('subheaderRecover')}
              </Header.Subheader>
              <br />
              <p className='spam-mark'>{t('subheaderRecoverSpam')}</p>
              <br />
              <Form onSubmit={forgot}>
                <Form.Field>
                  <Input
                    icon='envelope' iconPosition='left'
                    name='email'
                    placeholder={t('form:email')}
                    type='email'
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Form.Field>
                <Button type='submit' color='blue' className='fullwidth-button'>{t('form:sendInstructions')}</Button>
                {!isMobile && <div className='auth-footer text-center'>
                  <div>{t('form:rememberPassword')} <Link to='/login'>{t('form:signIn')}</Link></div>
                </div>}
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
}

export default RecoverPassword
