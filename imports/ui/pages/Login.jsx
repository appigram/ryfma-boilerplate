import React from 'react'
import { translate } from 'react-i18next'
import { withApollo } from 'react-apollo'
import { withCookies } from 'react-cookie'
import { Link, withRouter } from 'react-router-dom'
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'
import TwitterLogin from 'react-twitter-auth'
import { loginWithPassword, loginWithFacebook, loginWithGoogle } from '../components/Common/meteor-apollo-accounts'
import {Notification} from '../components/Notification/Notification'
import SEO from '../components/Common/SEO'
import store from '/lib/store'
import ReactGA from 'react-ga'

import { Header, Form, Button, Input, Icon } from 'semantic-ui-react'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      emailUsername: '',
      password: ''
    }
    this.login = this.login.bind(this)
    this.loginFacebook = this.loginFacebook.bind(this)
    this.loginGoogle = this.loginGoogle.bind(this)
    this.loginTwitter = this.loginTwitter.bind(this)
  }

  componentDidMount () {
    const token = store.getItem('Meteor.loginToken') || null
    if (token) {
      this.props.history.push('/')
    }
  }

  redirectToApp = () => {
    Notification.success(this.props.t('common:notif.logged'))
    this.props.cookies.set('meteor_login_token', store.getItem('Meteor.loginToken'), { path: '/' })
    this.props.history.push('/?refresh')
    this.props.client.resetStore()
  }

  // Password Auth
  async login (event) {
    event.preventDefault()

    const email = this.state.emailUsername
    const username = this.state.emailUsername
    const password = this.state.password
    const loginObject = email.indexOf('@') > -1
      ? { email, password }
      : { username, password }

    try {
      await loginWithPassword(loginObject, this.props.client)
      ReactGA.event({
        category: 'User',
        action: 'LoginWithEmail'
      })
      this.redirectToApp()
    } catch (error) {
      Notification.error(error)
    }
  }

  // Facebook Auth
  async loginFacebook ({ accessToken }) {
    try {
      await loginWithFacebook({ accessToken }, this.props.client)
      ReactGA.event({
        category: 'User',
        action: 'LoginWithFacebook'
      })
      this.redirectToApp()
    } catch (error) {
      Notification.error(error)
    }
  }

  responseFacebook (response) {
    if (!response.accessToken) return
    this.loginFacebook(response)
  }

  // Google Auth
  async loginGoogle ({ accessToken }) {
    console.log('Login to Google')
    try {
      await loginWithGoogle({ accessToken }, this.props.client)
      ReactGA.event({
        category: 'User',
        action: 'LoginWithGoogle'
      })
      this.redirectToApp()
    } catch (error) {
      Notification.error(error)
    }
  }

  responseGoogle (response) {
    if (!response.accessToken) return
    this.loginGoogle(response)
  }

  // Twitter Auth
  async loginTwitter (props) {
    return
    try {
      // await loginWithGoogle({ accessToken }, this.props.client)
      ReactGA.event({
        category: 'User',
        action: 'LoginWithTwitter'
      })
      this.redirectToApp()
    } catch (error) {
      Notification.error(error)
    }
  }

  responseTwitter (response) {
    console.log(response)
    if (!response.accessToken) return
    this.loginTwitter(response)
  }

  render () {
    const { t } = this.props
    return (
      <div className='auth-page'>
        <SEO
          schema='Webpage'
          title={t('seoTitle')}
          description={t('seoDesc')}
          path='/login'
          contentType='product'
        />
        <div className='outer-wrapper'>
          <div className='middle'>
            <div className='inner'>
              <Header as='h1'>{t('header')}</Header>
              <Header.Subheader>
                {t('subheader')}
              </Header.Subheader>

              <div className='social-login'>
                <FacebookLogin
                  cssClass='facebook-login-button'
                  appId='1127643753917982'
                  fields='name,email,picture'
                  scope='public_profile,email'
                  callback={() => this.responseFacebook()}
                  textButton=''
                  icon={<span><Icon name='facebook' />Facebook</span>}
                />
                <GoogleLogin
                  className='facebook-login-button'
                  clientId='764374681772-7g6j36j51m960ufaop8hjj87pahrail6.apps.googleusercontent.com'
                  buttonText={<span><Icon name='google' />Google</span>}
                  onSuccess={() => this.responseGoogle()}
                  onFailure={() => this.responseGoogle()}
                />
                <TwitterLogin
                  className='facebook-login-button'
                  text={<span><Icon name='twitter' />Twitter</span>}
                  showIcon={false}
                  requestTokenUrl='https://api.twitter.com/oauth/request_token'
                  onFailure={() => this.responseTwitter()}
                  onSuccess={() => this.responseTwitter()}
                />
                {/* <Button circular color='twitter' icon='twitter' />
                <Button circular color='vk' icon='vk' /> */}
              </div>

              <div className='text-separator'>
                <span className='label'>{t('common:or')}</span>
              </div>

              <Form onSubmit={this.login}>
                <Form.Field>
                  <Input
                    icon='mail' iconPosition='left'
                    name='emailUsername'
                    placeholder={t('common:form.emailUsername')}
                    type='text'
                    required='true'
                    value={this.state.emailUsername}
                    onChange={(event) => this.setState({ emailUsername: event.target.value })}
                  />
                </Form.Field>
                <Form.Field>
                  <Input
                    icon='lock' iconPosition='left'
                    name='password'
                    placeholder={t('common:form.password')}
                    type='password'
                    required='true'
                    value={this.state.password}
                    onChange={(event) => this.setState({ password: event.target.value })}
                  />
                </Form.Field>
                <Button type='submit' color='green' className='fullwidth-button'>{t('common:form.signIn')}</Button>
                <div className='auth-footer'>
                  <div>
                    <Link to='/recover-password'>{t('common:form.forgotPassword')}</Link>
                  </div>
                  <div>{t('common:form.noAccount')} <Link to='/register'>{t('common:form.signUp')}</Link></div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default translate('login')(withCookies(withApollo(withRouter(Login))))
