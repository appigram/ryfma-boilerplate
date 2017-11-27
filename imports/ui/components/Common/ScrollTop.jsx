import React from 'react'
import { translate } from 'react-i18next'
import { Icon } from 'semantic-ui-react'
import ScrollToTop from 'react-scroll-up'

const ScrollTop = (props) => {
  const { t } = props
  return (
    <ScrollToTop showUnder={600} style={{
      position: 'fixed',
      bottom: '50px',
      left: '30px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}
    >
      <div id='backto-top'>
        <div id='backto-bg'>
          <Icon name='angle up' size='big' />
          <nobr id='backto-text'>
            {t('toTop')}
          </nobr>
        </div>
      </div>
    </ScrollToTop>
  )
}

export default translate()(ScrollTop)
