import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Route } from 'react-router-dom'
import AdvBanner from '/imports/ui/components/Adv/AdvBanner'

// if (typeof window !== 'undefined') {
  // import '/imports/styles/NotFound'
// }

const NotFound = () => {
  const [t] = useTranslation('notFound')
  return (<Route render={({ staticContext }) => {
    if (staticContext) {
      staticContext.status = 404
    }
    return (<div className='error-page'>
      <meta name="robots" content="noindex, nofollow, noarchive, noyaca, none" />
      <div className='outer-wrapper'>
        <div className='middle'>
          <div className='inner'>
            <img src='https://cdn.ryfma.com/defaults/icons/ryfma-404.png' />
            <h1>{t('notFoundHeader')}</h1>
            <p>{t('notFoundSubheader')}</p>
            <Link to='/' className='ui button primary'>{t('backToHome')}</Link>
            <AdvBanner adType='postPageNative' statId={123} />
          </div>
        </div>
      </div>
    </div>)
  }}
  />)
}

export default NotFound
