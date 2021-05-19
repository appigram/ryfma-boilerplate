import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApolloClient } from '@apollo/client/react'
import getCurrentUser from '/imports/graphqls/queries/User/getCurrentUser'
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom'
import { Header, Form, Button, Checkbox, Input, Message } from 'semantic-ui-react'
import { Notification } from '/imports/ui/components/Notification/Notification'
import Accounts from '/imports/shared/meteor-react-apollo-accounts'
import FacebookLogin from 'react-facebook-login'
import VKLogin from '/imports/ui/components/Common/react-vk-login'
import GoogleLogin from 'react-google-login'

import Facebook from 'react-feather/dist/icons/facebook'
import VK from '/imports/shared/svg/vk'
import Google from '/imports/shared/svg/google'

import SEO from '/imports/ui/components/Common/SEO'
import store from '/lib/store'
import Cookies from 'js-cookie'
import ReactGA from 'react-ga'
import getQueryParam from '/lib/utils/helpers/getQueryParam'
import loginScreens from '/lib/utils/helpers/loginScreens'
import { useAuth } from '/imports/hooks'

const isDev = process.env.NODE_ENV === 'development'
let redirectUri = 'https://ryfma.com/register'
if (isDev) {
  redirectUri = 'http://localhost:3000/register'
}

function Signup({ referer = '/', isMinimal = false }) {
  const [t] = useTranslation(['signup', 'form', 'notif_public'])
  const history = useHistory()
  const client = useApolloClient()
  const { search } = useLocation()
  const { token, signin } = useAuth()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [accepted, setAccepted] = useState(true)
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorName, setErrorName] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(true)
  const [randomScreen, setRandomScreen] = useState(loginScreens[0])

  const refererQuery = getQueryParam(search, 'referer')
  const toReferer = refererQuery || referer
  const redirectSocialUriLink = redirectUri + `?referer=${toReferer}`

  useEffect(() => {
    setRandomScreen(loginScreens[Math.floor(Math.random() * Math.floor(7))])
  }, [])

  if (token) {
    return <Redirect to='/' />
  }

  const getUser = () => {
    const newToken = Accounts.getLoginToken()
    Cookies.set('meteor_login_token', newToken)
    setPageLoaded(false)
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
      // Cookies.remove('meteor_login_token', { secure: true, HttpOnly: true })
      Notification.error(error)
    })
  }


  const register = async () => {
    const refToken = store.getItem('Meteor.referralToken') || ''
    const profile = refToken ? { name: refToken } : {} // hack to pass refID

    if (!accepted) {
      Notification.warning(t('notif_public:acceptTerms'))
    }

    try {
      const response = await Accounts.createUser({ username: username.trim(), email: email.trim(), password, profile })
      if (response) {
        ReactGA.event({
          category: 'User',
          action: 'RegisterByEmail',
          label: `RegisterByEmail: ${username}`,
          value: 1
        })
        store.removeItem('Meteor.referralToken')
        getUser()
      }
    } catch (error) {
      if (error.message.indexOf('Email already exists') > 0) {
        Notification.error('Адрес электронной почты уже кем-то занят')
        setErrorEmail(true)
      } else if (error.message.indexOf('Username already exists') > 0) {
        Notification.error('Имя пользователя уже занято')
        setErrorName(true)
      } else {
        Notification.error(error)
      }
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
        action: 'RegisterByFacebook',
        label: 'RegisterByFacebook',
        value: 1
      })
      Notification.success(t('notif_public:logged'))
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
        action: 'RegisterByVK',
        label: 'RegisterByVK',
        value: 1
      })
      Notification.success(t('notif_public:logged'))
      getUser()
    } catch (error) {
      console.log(error)
      Notification.error(error)
    }
  }

  const responseVK = async (response) => loginVK(response)

  const loginGoogle = async ({ accessToken }) => {
    if (!accessToken) {
      Notification.error('accessToken not found')
      return
    }
    const invitedByUserId = store.getItem('Meteor.referralToken') || ''

    try {
      const response = await Accounts.loginWithGoogle({ accessToken, invitedByUserId })
      if (response) {
        ReactGA.event({
          category: 'User',
          action: 'RegisterByGoogle',
          label: 'RegisterByGoogle',
          value: 1
        })
        getUser()
      }
    } catch (error) {
      Notification.error(error)
    }
  }

  const responseGoogle = async (response) => loginGoogle(response)

  const handleAcceptTerms = () => setAccepted(!accepted)

  return (
    <div>
      <div className='auth-page'>
        <SEO
          schema='Webpage'
          title={t('seoTitle')}
          description={t('seoDesc')}
          path='register'
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
              <Header as='h1'>{t('header')}</Header>
              <div className='social-login'>
                <VKLogin
                  cssClass='vk-login-button'
                  clientId='4957795'
                  fields='name,email,picture'
                  scope='public_profile,email'
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
                {/* <InstagramLogin
                    className='instagram-login-button'
                    clientId="11d1abf33b574894a3c40dd4cf3effe6"
                    buttonText={<span><i aria-hidden='true' className='icon instagram' />Instagram</span>}
                    onSuccess={responseInstagram}
                    onFailure={responseInstagram}
                  /> */}
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

              <Form onSubmit={register}>
                <Form.Field>
                  <label>{t('form:email')}</label>
                  <Input
                    icon='envelope' iconPosition='left'
                    name='email'
                    error={errorEmail}
                    placeholder={t('form:email')}
                    type='email'
                    required
                    value={email}
                    autoComplete='email'
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setErrorEmail(false)
                    }}
                  />
                  {errorEmail && <Message negative attached='top'>
                    <Message.Header>Email уже занят</Message.Header>
                    <p>Адрес электронной почты уже кем-то занят. Используйте другой адрес.</p>
                  </Message>}
                </Form.Field>
                <Form.Field>
                  <label>{t('form:name')}</label>
                  <Input
                    icon='user' iconPosition='left'
                    name='yourName'
                    error={errorName}
                    placeholder={t('form:name')}
                    type='text'
                    required
                    value={username}
                    autoComplete='name'
                    onChange={(event) => {
                      setUsername(event.target.value)
                      setErrorName(false)
                    }}
                  />
                  {errorName && <Message negative attached='top'>
                    <Message.Header>Имя пользователя занято</Message.Header>
                    <p>Это имя пользователя уже существует. Попробуйте добавить фамилию к указанному имени или цифры.<br /> Например, <b>{username} Иванов</b> или <b>{username}123</b></p>
                  </Message>}
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
                    autoComplete='new-password'
                    onChange={(event) => {
                      setPassword(event.target.value)
                    }}
                  />
                </Form.Field>
                <br />
                <Form.Field>
                  <Checkbox
                    checked={accepted}
                    label={<label>{t('haveToRead')} <Link to='/terms' rel='noopener nofollow'>{t('terms')}</Link> {t('and')} <Link to='/privacy' rel='noopener nofollow'>{t('privacy')}</Link></label>}
                    onChange={handleAcceptTerms}
                  />
                </Form.Field>
                <Button type='submit' color={pageLoaded ? 'blue' : 'grey'} className='fullwidth-button' disabled={!pageLoaded || !accepted}>
                  {pageLoaded ? t('form:createAccount') : t('common:loading')}
                </Button>

                <div className='auth-footer text-center'>
                  <div>{t('alreadyAMember')} <Link to={referer ? `/login?referer=${referer}` : '/login'}>{t('form:signIn')}</Link></div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
