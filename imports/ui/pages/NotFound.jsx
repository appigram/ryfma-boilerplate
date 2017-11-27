import React from 'react'
import { translate } from 'react-i18next'
import { Link, Route } from 'react-router-dom'

const NotFound = ({t}) => (
  <Route render={({ staticContext }) => {
    if (staticContext) {
      staticContext.status = 404
    }
    return (<div className='not-found-page'>
      <div className='outer-wrapper'>
        <div className='middle'>
          <div className='inner'>
            <img src='https://cdnryfma.s3.amazonaws.com/defaults/icons/ryfma-404-cat.jpg' />
            <h1>{t('header')}</h1>
            <p>{t('subheader')}</p>
            <Link to='/'>{t('backToHome')}</Link>
          </div>
        </div>
      </div>
    </div>)
  }} />
)

export default translate('notFound')(NotFound)
