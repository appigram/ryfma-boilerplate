import React from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'

const PublicHeader = (props) => (
  <Link to='/login' className='ui primary button login-button'>{props.t('common:form.login')}</Link>
)

export default translate()(PublicHeader)
