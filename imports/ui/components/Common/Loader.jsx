import React from 'react'
import { translate } from 'react-i18next'

const Loader = (props) => (
  <div className='spinner inner-scope'>
    <div className='spinner-wrapper'>
      <div className='coffee_cup' />
      <div className='spinner-text'>{props.t('common:loading')}</div>
    </div>
  </div>
)

export default translate()(Loader)
