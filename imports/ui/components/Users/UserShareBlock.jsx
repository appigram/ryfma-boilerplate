import React from 'react'
import { translate } from 'react-i18next'
import { Card } from 'semantic-ui-react'
import Share from '../Common/Share'

class UserShareBlock extends React.Component {
  render () {
    const { t, url, author, bio, image } = this.props
    return (
      <Card className='sidebar-card'>
        <Card.Content>
          <Card.Header>
            {t('shareProfile')}
          </Card.Header>
        </Card.Content>
        <Card.Content className='body'>
          <Share type='big' shareUrl={url} title={`Страница автора "${author}" на MO.ST`} description={bio} image={image} />
        </Card.Content>
      </Card>
    )
  }
}

export default translate('user')(UserShareBlock)
