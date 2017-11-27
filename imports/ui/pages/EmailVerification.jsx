import React from 'react'
import { translate } from 'react-i18next'
import { withApollo } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
import { verifyEmail, resendVerificationEmail } from '../components/Common/meteor-apollo-accounts'
import {Notification} from '../components/Notification/Notification'
import { Header, Form, Button, Input } from 'semantic-ui-react'
import SEO from '../components/Common/SEO'

class EmailVerification extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      verified: false
    }
    this.resend = this.resend.bind(this)
  }

  async componentDidMount () {
    const { token } = this.props.match.params

    if (token) {
      try {
        await verifyEmail({ token }, this.props.client)
        this.setState({ verified: true })
        Notification.success(this.props.t('common:notif.emailVerified'))
        this.props.history.push('/?refresh')
      } catch (error) {
        Notification.error(error)
        this.props.history.push('/email-verification')
      }
    }
  }

  async resend (event) {
    event.preventDefault()

    const email = this.state.email

    try {
      await resendVerificationEmail({ email }, this.props.client)
      Notification.success(this.props.t('common:notif.emailConfirmationSend'))
    } catch (error) {
      Notification.error(error)
    }
  }

  render () {
    const { t } = this.props

    const { token } = this.props.match.params

    if (!token) {
      return (
        <div className='auth-page'>
          <SEO
            schema='Webpage'
            title='Email verification'
            description='Email verification'
            path='/'
            contentType='product'
          />
          <div className='outer-wrapper'>
            <div className='middle'>
              <div className='inner'>
                <Header as='h1'>{t('header')}</Header>

                <Header.Subheader>{t('subheader')}</Header.Subheader>
                { !this.state.verified
                  ? <div>
                    <div className='text-separator'>
                      <span className='label'>{t('common:or')}</span>
                    </div>

                    <div>
                      <Header.Subheader>{t('sendAgain')}</Header.Subheader>
                    </div>
                    <br />

                    <Form onSubmit={this.resend.bind(this)}>
                      <Form.Field>
                        <Input
                          icon='mail' iconPosition='left'
                          name='email'
                          placeholder={t('common:form:email')}
                          type='email'
                          required='true'
                          value={this.state.email}
                          onChange={(event) => this.setState({ email: event.target.value })}
                        />
                      </Form.Field>
                      <Button type='submit' color='green' className='fullwidth-button'>{t('common:form.resend')}</Button>
                    </Form >
                  </div>
                : null
                }
              </div>
            </div>
          </div>
        </div>
      )
    }

    const { verified } = this.state

    return (
      <div className='auth-page'>
        <SEO
          schema='Webpage'
          title='Email verification'
          description='Email verification'
          path='/'
          contentType='product'
        />
        <div className='outer-wrapper'>
          <div className='middle'>
            <div className='inner'>
              <Header as='h1'>{t('header')}</Header>

              { (!token && !verified)
                ? <Header.Subheader>{t('subheader')}</Header.Subheader>
                : ''
              }

              { verified
                ? <div>
                  <Header.Subheader>{t('verified')}</Header.Subheader>
                  <br />
                  <Link to='/'>{t('goToWebsite')}</Link>
                </div>
                : ''
              }

              { (token && !verified) ? <Header.Subheader>{t('notVerified')}</Header.Subheader> : '' }

              { !verified
                ? <div>
                  <div className='text-separator'>
                    <span className='label'>{t('common:or')}</span>
                  </div>

                  <div>
                    <Header.Subheader>{t('sendAgain')}</Header.Subheader>
                  </div>
                  <br />

                  <Form onSubmit={this.resend.bind(this)}>
                    <Form.Field>
                      <Input
                        icon='mail' iconPosition='left'
                        name='email'
                        placeholder={t('common:form:email')}
                        type='email'
                        required='true'
                        value={this.state.email}
                        onChange={(event) => this.setState({ email: event.target.value })}
                      />
                    </Form.Field>
                    <Button type='submit' color='green' className='fullwidth-button'>{t('common:form.resend')}</Button>
                  </Form >
                </div>
              : null
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default translate('emailVerify')(withApollo(withRouter(EmailVerification)))
