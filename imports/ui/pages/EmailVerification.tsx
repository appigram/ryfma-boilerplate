import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useParams } from 'react-router-dom'
import Accounts from '/imports/shared/meteor-react-apollo-accounts'
import { Notification } from '/imports/ui/components/Notification/Notification'
import { Header, Form, Button, Input } from 'semantic-ui-react'
import SEO from '/imports/ui/components/Common/SEO'
import { useAuth } from '/imports/hooks'

function EmailVerification() {
  const [t] = useTranslation(['emailVerify', 'form', 'notif'])
  const history = useHistory()
  const { token } = useParams()
  const { currUser, setCurrUser } = useAuth()
  const [email, setEmail] = useState('')
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (token) {
      async function verifyEmailFunc() {
        try {
          await Accounts.verifyEmail({ token })
          setVerified(true)
          Notification.success(t('notif:emailVerified'))
          if (currUser) {
            const newUser = currUser
            newUser.emails[0].address.verified = true
            setCurrUser(newUser)
          }
          history.push('/')
        } catch (error) {
          Notification.error(error)
          history.push('/email-verification')
        }
      }
      verifyEmailFunc()
    }
  }, [])

  const resend = async (event) => {
    event.preventDefault()

    try {
      await Accounts.resendVerificationEmail({ email })
      Notification.success(t('notif:emailConfirmationSend'))
    } catch (error) {
      Notification.error(error)
    }
  }

  if (!token) {
    return (
      <div className='auth-page'>
        <SEO
          schema='Webpage'
          title='Email verification'
          description='Email verification'
          path='email-verification'
          contentType='product'
          noIndex={true}
          noFollow={true}
        />
        <div className='outer-wrapper'>
          <div className='middle'>
            <div className='inner'>
              <Header as='h1'>{t('header')}</Header>

              <Header.Subheader>{t('subheader')}</Header.Subheader>
              {!verified
                ? <div>
                  <div className='text-separator'>
                    <span className='label'>{t('common:or')}</span>
                  </div>

                  <div>
                    <Header.Subheader>{t('sendAgain')}</Header.Subheader>
                  </div>
                  <br />

                  <Form onSubmit={resend}>
                    <Form.Field>
                      <Input
                        icon='envelope' iconPosition='left'
                        name='email'
                        placeholder={t('common:form:email')}
                        type='email'
                        required='true'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </Form.Field>
                    <Button type='submit' color='green' className='fullwidth-button'>{t('resend')}</Button>
                  </Form>
                </div>
                : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='auth-page'>
      <SEO
        schema='Webpage'
        title='Email verification'
        description='Email verification'
        path='email-verification'
        contentType='product'
        noIndex={true}
        noFollow={true}
      />
      <div className='outer-wrapper'>
        <div className='middle'>
          <div className='inner'>
            <Header as='h1'>{t('header')}</Header>

            {(!token && !verified)
              ? <Header.Subheader>{t('subheader')}</Header.Subheader>
              : ''}

            {verified
              ? <div>
                <Header.Subheader>{t('verified')}</Header.Subheader>
                <br />
                <Link to='/'>{t('goToWebsite')}</Link>
              </div>
              : ''}

            {(token && !verified) ? <Header.Subheader>{t('notVerified')}</Header.Subheader> : ''}

            {!verified
              ? <div>
                <div className='text-separator'>
                  <span className='label'>{t('common:or')}</span>
                </div>

                <div>
                  <Header.Subheader>{t('sendAgain')}</Header.Subheader>
                </div>
                <br />

                <Form onSubmit={resend}>
                  <Form.Field>
                    <Input
                      icon='envelope' iconPosition='left'
                      name='email'
                      placeholder={t('common:form:email')}
                      type='email'
                      required='true'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </Form.Field>
                  <Button type='submit' color='green' className='fullwidth-button'>{t('form:resend')}</Button>
                </Form>
              </div>
              : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
