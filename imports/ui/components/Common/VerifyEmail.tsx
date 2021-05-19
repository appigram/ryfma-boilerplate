import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Accounts from '/imports/shared/meteor-react-apollo-accounts'
import { Form } from 'semantic-ui-react'
import Check from 'react-feather/dist/icons/check'
import X from 'react-feather/dist/icons/x'
import { Notification } from '/imports/ui/components/Notification/Notification'
import TimerCountdown from '/imports/ui/components/Common/TimerCountdown'
import { useMutation } from '@apollo/client/react'
import { useAuth } from '/imports/hooks'
import saveEmail from '/imports/graphqls/mutations/User/saveEmail'

import ReactGA from 'react-ga'

function VerifyEmail ({ currEmail }) {
  const [t] = useTranslation(['form', 'notif'])
  const { currUser, setCurrUser } = useAuth()

  const [email, setEmail] = useState(currEmail ? currEmail.address : '')
  const [isEmailVerified, setIsEmailVerified] = useState(currEmail ? currEmail.verified : false)
  const [emailVerificationSend, setEmailVerificationSend] = useState(false)
  const [emailVerifyButtonDisabled, setEmailVerifyButtonDisabled] = useState(false)
  const [isEmailError, setIsEmailError] = useState(false)
  const [emailSaveButtonDisabled, setEmailSaveButtonDisabled] = useState(false)
  const [countDown, setCountDown] = useState(null)
  const [showCountDown, setShowCountDown] = useState(false)

  const [saveEmailMutation] = useMutation(saveEmail)

  const handleChangeEmail = (event, { name, value }) => {
    setEmail(value)
    if (currEmail !== value) {
      setIsEmailVerified(false)
      setEmailSaveButtonDisabled(false)
    }
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const handleSaveEmail = async (event) => {
    setEmailSaveButtonDisabled(true)
    if (!validateEmail(email)) {
      Notification.error(t('notif:emailIsWrong'))
    }

    const settingsVariables = {
      email
    }

    try {
      await saveEmailMutation({ variables: settingsVariables })
      ReactGA.event({
        category: 'User',
        action: 'UserUpdateEmail',
        label: `UserUpdateEmail: uId - ${currUser._id}`,
        value: 1
      })
      const newUser = currUser
      newUser.emails[0].address = email
      setCurrUser(newUser)
      // Notification.success(t('notif:accountUpdated'))
      Notification.success(t('notif:emailConfirmationSend'))
      setEmailSaveButtonDisabled(false)
      // window.location.reload()
    } catch (error) {
      Notification.error(error)
      setEmailSaveButtonDisabled(false)
    }
  }

  const handleVerifyEmail = async (event) => {
    event.preventDefault()
    setEmailVerifyButtonDisabled(true)
    try {
      await Accounts.resendVerificationEmail({ email })
      Notification.success(t('notif:emailConfirmationSend'))
      setShowCountDown(true)
      ReactGA.event({
        category: 'User',
        action: 'UserVerify',
        label: `UserVerify: uId - ${currUser._id}`,
        value: 1
      })
      const currDate = new Date()
      const waitMinutes = 1 * 60000
      const newDateObj = new Date(currDate.getTime() + waitMinutes)
      setCountDown(newDateObj)
      setTimeout(() => {
        setShowCountDown(false)
        setCountDown(null)
        setEmailVerifyButtonDisabled(false)
      }, waitMinutes)
    } catch (error) {
      Notification.error(error)
      setEmailVerifyButtonDisabled(false)
    }
  }

  /* if (email.verified) {
    return null
  } */

  if (!currEmail) {
    return (
      <div className='verification-email-block add-email'>
        {t('common:verifyAddEmail')} <Form.Input error={isEmailError} value={email} onChange={handleChangeEmail} name='email' type='email' placeholder={t('form:email')} icon={email ? (isEmailVerified ? <Check size={18} className='success' /> : <X size={18} className='error' />) : null} /> <button disabled={emailSaveButtonDisabled} onClick={handleSaveEmail}>{t('common:verifySaveEmail')}</button>
        {showCountDown && <div className='resend-countdown'>{t('common:resendAllowAfter')}<TimerCountdown to={countDown} isShort={true} /></div>}
      </div>
    )
  } else {
    return (
      <div className='verification-email-block'>
        {t('common:verifyMyEmail')} <b>{currEmail.address}</b> {t('verifyMyEmail2')}<button disabled={emailVerifyButtonDisabled} onClick={handleVerifyEmail}>{t('common:verifyEmailLink')}</button>
        {showCountDown && <div className='resend-countdown'>{t('common:resendAllowAfter')}<TimerCountdown to={countDown} isShort={true} /></div>}
      </div>
    )
  }
}

export default VerifyEmail
