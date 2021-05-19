import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApolloClient } from '@apollo/client/react'
import getCurrentUser from '/imports/graphqls/queries/User/getCurrentUser'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom'
import Accounts from '/imports/shared/meteor-react-apollo-accounts'
import FacebookLogin from 'react-facebook-login'
import VKLogin from '/imports/ui/components/Common/react-vk-login'
import GoogleLogin from 'react-google-login'

import { Notification } from '/imports/ui/components/Notification/Notification'
import SEO from '/imports/ui/components/Common/SEO'

import Facebook from 'react-feather/dist/icons/facebook'
import VK from '/imports/shared/svg/vk'
import Google from '/imports/shared/svg/google'

import Cookies from 'js-cookie'
import store from '/lib/store'
import ReactGA from 'react-ga'
import getQueryParam from '/lib/utils/helpers/getQueryParam'
import loginScreens from '/lib/utils/helpers/loginScreens'
import { Header, Form, Button, Input } from 'semantic-ui-react'
import { useAuth } from '/imports/hooks'

const isDev = process.env.NODE_ENV === 'development'
let redirectUri = 'https://ryfma.com/login'
if (isDev) {
  redirectUri = 'http://localhost:3000/login'
}

function Login({ referer = '/', isMinimal = false }) {
  const [t] = useTranslation(['login', 'form', 'notif_public'])
  const history = useHistory()
  const { search } = useLocation()
  const client = useApolloClient()
  const { token, signin } = useAuth()

  const [emailUsername, setEmailUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isEmailUsernameError, setIsEmailUsernameError] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(true)
  const [randomScreen, setRandomScreen] = useState(loginScreens[0])

  const refererQuery = getQueryParam(search, 'referer')
  const toReferer = refererQuery || referer
  const redirectSocialUriLink = redirectUri + `?referer=${toReferer}`

  useEffect(() => {
    setRandomScreen(loginScreens[Math.floor(Math.random() * Math.floor(7))])
  }, [])

  /* let timerId = null
  const getRandomScreen = () => {
    setRandomScreen(loginScreens[Math.floor(Math.random() * Math.floor(7))])
  }

  useEffect(() => {
    timerId = setInterval(getRandomScreen, 20000)

    return clearInterval(timerId)
  }, []) */

  if (token) {
    return <Redirect to={toReferer} />
  }

  const getUser = () => {
    const newToken = Accounts.getLoginToken()
    Cookies.set('meteor_login_token', newToken)
    client.query({
      query: getCurrentUser,
      fetchPolicy: 'network-only'
    }).then((graphQLResult) => {
      const { errors, data } = graphQLResult

      if (errors) {
        if (errors.length > 0) {
          Notification.error(errors[0].message)
        }
      } else {
        // Update posts data
        if (data.me) {
          console.log('Set User data Login')
          Notification.success(t('notif_public:logged'))
          signin({ currUser: data.me, token: newToken })
          // client.resetStore()
          history.push(toReferer)
        } else {
          setPageLoaded(true)
          window.location.reload()
        }
      }
    }).catch((error) => {
      // store.removeItem('Meteor.loginToken')
      // store.removeItem('Meteor.loginTokenExpires')
      // Cookies.remove('meteor_login_token')
      Notification.error(error)
    })
  }

  // Password Auth
  const login = async () => {
    const emailRegex = new RegExp(/[а-яА-Я]/gi)
    if (emailRegex.test(emailUsername)) {
      Notification.error('Имя пользователя или email должны содержать только английские символы')
      setIsEmailUsernameError(true)
    }
    const loginField = emailUsername.trim().toLowerCase()
    const loginObject = loginField.indexOf('@') > -1
      ? { username: null, email: loginField, password }
      : { username: loginField, email: null, password }

    if (!password || !loginField) {
      Notification.error('Введите имя и пароль')
    }

    try {
      await Accounts.loginWithPassword(loginObject)
      ReactGA.event({
        category: 'User',
        action: 'LoginWithEmail',
        label: `LoginWithEmail: ${loginField}`,
        value: 1
      })
      getUser()
    } catch (error) {
      Notification.error(error)
    }
  }

  // Facebook Auth
  const loginFacebook = async ({ accessToken }) => {
    if (!accessToken) {
      Notification.error('accessToken not found')
      return
    }
    const invitedByUserId = store.getItem('Meteor.referralToken') || ''

    try {
      await Accounts.loginWithFacebook({ accessToken, invitedByUserId })
      ReactGA.event({
        category: 'User',
        action: 'LoginWithFacebook',
        label: 'LoginWithFacebook',
        value: 1
      })
      getUser()
    } catch (error) {
      Notification.error(error)
    }
  }

  const responseFacebook = async (response) => loginFacebook(response)

  // VK Auth
  const loginVK = async (params) => {
    const invitedByUserId = store.getItem('Meteor.referralToken') || ''
    const options = {
      ...params,
      invitedByUserId
    }
    try {
      await Accounts.loginWithVK(options)
      ReactGA.event({
        category: 'User',
        action: 'LoginWithVK',
        label: 'LoginWithVK',
        value: 1
      })
      getUser()
    } catch (error) {
      console.log(error)
      Notification.error(error)
    }
  }

  const responseVK = async (response) => loginVK(response)

  // Google Auth
  const loginGoogle = async ({ accessToken }) => {
    if (!accessToken) {
      Notification.error('accessToken not found')
      return
    }
    const invitedByUserId = store.getItem('Meteor.referralToken') || ''
    try {
      await Accounts.loginWithGoogle({ accessToken, invitedByUserId })
      ReactGA.event({
        category: 'User',
        action: 'LoginWithGoogle',
        label: 'LoginWithGoogle',
        value: 1
      })
      getUser()
    } catch (error) {
      Notification.error(error)
    }
  }

  const responseGoogle = async (response) => loginGoogle(response)

  return (<div>
    <div className='auth-page'>
      <SEO
        schema='Webpage'
        title={t('seoTitle')}
        description={t('seoDesc')}
        path='login'
        contentType='website'
        noIndex={true}
        noFollow={true}
      />
      {!isMinimal && <section className="auth-sidebar" style={{ background: randomScreen.backgroundColor }}>
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
              {t('learnMoreOn')} {randomScreen.url && <Link to={randomScreen.url} className="url" target="_blank">{randomScreen.shortTitle}</Link>}
            </p>
          </div>
        </div>
      </section>}
      <div className='content'>
        <div className='inner-content'>
          <div className='auth-content'>
            <Header as='h1'>{t('header')}</Header>
            <div className='social-login'>
              <VKLogin
                cssClass='vk-login-button'
                clientId='4957795'
                fields='name,email,picture'
                scope='public_profile,email,wall'
                callback={responseVK}
                text={<span><VK size={20} />Войти через ВКонтакте</span>}
                redirectUri={redirectSocialUriLink}
              />
              <FacebookLogin
                cssClass='facebook-login-button'
                appId='1127643753917982'
                fields='name,email,picture'
                scope='public_profile,email'
                callback={responseFacebook}
                textButton=''
                icon={<span><Facebook size={20} /></span>}
                version='9.0'
              />
              <GoogleLogin
                className='google-login-button'
                clientId='764374681772-p353od1hvr678a3l9en1o3c420k9bij8.apps.googleusercontent.com'
                render={renderProps => (<span>
                  <button type='button' className='google-login-button metro' onClick={renderProps.onClick} disabled={renderProps.disabled}>
                    <span>
                      <Google size={20} />
                    </span>
                  </button>
                </span>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
              />
            </div>

            <div className='text-separator'>
              <span className='label'>{t('common:or')}</span>
            </div>

            <Form onSubmit={login}>
              <Form.Field>
                <label>{t('form:emailUsername')}</label>
                <Input
                  error={isEmailUsernameError}
                  icon='envelope' iconPosition='left'
                  name='emailUsername'
                  placeholder={t('form:emailUsername')}
                  type='text'
                  required
                  value={emailUsername}
                  autoComplete='username'
                  onChange={(event) => {
                    setEmailUsername(event.target.value)
                    setIsEmailUsernameError(false)
                  }}
                />
              </Form.Field>
              <Form.Field>
                <label>{t('form:password')}</label>
                <Input
                  icon='lock' iconPosition='left'
                  name='password'
                  placeholder={t('form:password')}
                  type='password'
                  required
                  value={password}
                  autoComplete='current-password'
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Field>
              <Button type='submit' color={pageLoaded ? 'blue' : 'grey'} className='fullwidth-button' disabled={!pageLoaded}>
                {pageLoaded ? t('form:signIn') : t('common:loading')}
              </Button>
              <div className='auth-footer'>
                <div>
                  <Link to='/recover-password'>{t('form:forgotPassword')}</Link>
                </div>
                <div>{t('form:noAccount')} <Link to={referer ? `/register?referer=${referer}` : '/register'} rel='noopener nofollow'>{t('form:signUp')}</Link></div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>)
}

export default Login
