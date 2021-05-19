import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Route } from 'react-router-dom'

function AccessDenied () {
  const [t] = useTranslation('notFound')
  return (<Route render={({ staticContext }) => {
    if (staticContext) {
      staticContext.status = 403
    }
    return (<div className='error-page'>
      <div className='outer-wrapper'>
        <div className='middle'>
          <div className='inner'>
            <img src='https://cdn.ryfma.com/defaults/icons/ryfma-403.png' />
            <h1>{t('accessDeniedHeader')}</h1>
            <p>{t('accessDeniedSubheader')}</p>
            <Link to='/login' className='ui button primary'>{t('goToLogin')}</Link>
          </div>
        </div>
      </div>
    </div>)
  }}
  />)
}

export default AccessDenied
