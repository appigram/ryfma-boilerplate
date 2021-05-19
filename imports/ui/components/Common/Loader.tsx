import React from 'react'
import { useTranslation } from 'react-i18next'

function Loader () {
  const [t] = useTranslation('notif')
  return (<div className='spinner inner-scope'>
    <div className='spinner-wrapper'>
      <div className='coffee_cup' />
      <div className='spinner-text'>{t('common:loading')}</div>
    </div>
  </div>)
}

export default Loader
