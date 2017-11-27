import React from 'react'
import { translate } from 'react-i18next'
import {Notification} from '../Notification/Notification'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

class VerifyEmail extends React.Component {
  async sendLink () {
    try {
      await this.props.sendVerificationLink()
      Notification.success(this.props.t('common:notif.emailVerificationSend'))
    } catch (error) {
      Notification.error(error)
    }
  }

  render () {
    const { t } = this.props
    return (
      <div className='verirication-email-block'>
        {t('verifyEmail')} <a onClick={this.sendLink.bind(this)}>{t('verifyEmailLink')}</a>
      </div>
    )
  }
}

const sendVerificationLink = gql`
  mutation sendVerificationLink {
    sendVerificationLink
  }
`

VerifyEmail = graphql(sendVerificationLink, {
  props ({ mutate }) {
    return {
      sendVerificationLink () {
        return mutate()
      }
    }
  }
})(VerifyEmail)

export default translate()(VerifyEmail)
