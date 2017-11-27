import React from 'react'
import { translate } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import SEO from '../components/Common/SEO'
import store from '/lib/store'
import ReactGA from 'react-ga'

class ReferralPage extends React.Component {
  componentDidMount () {
    const refId = this.props.match.params.referralId
    ReactGA.event({
      category: 'User',
      action: 'RefferalNew',
      value: refId
    })
    store.setItem('Meteor.referralToken', refId)
  }

  render () {
    const { t } = this.props
    return (
      <div className='account-page'>
        <SEO
          schema='Webpage'
          title={t('seoTitle')}
          description={t('seoDesc')}
          path={`/r/${this.props.match.params.referralId}`}
          contentType='product'
        />
        <div className='outer-wrapper'>
          <div className='middle'>
            <div className='inner'>
              <h2>{t('header')}</h2>
              <p>{t('subheader')}</p>
              <Link className='ui button green' to='/register'>{t('letsStart')}</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default translate('referral')(withRouter(ReferralPage))
