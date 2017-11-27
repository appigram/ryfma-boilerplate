import React from 'react'
import { translate } from 'react-i18next'
import { Container, Grid, List } from 'semantic-ui-react'
import Sidebar from '../Sidebar/Sidebar'
import PostsList from '../Posts/PostsList'
import SEO from '../Common/SEO'
import { isMobile } from '/lib/utils/deviceDetect'

class NewPosts extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeFilter: 'day'
    }
  }

  render () {
    const { t } = this.props
    const { activeFilter } = this.state

    const filters = <List className='post-filters' link horizontal>
      <List.Item
        as='a'
        className={activeFilter === 'day' ? 'active' : ''}
        onClick={() => this.setState({ activeFilter: 'day' })}
      >
        {t('common:thisDay')}
      </List.Item>
      <List.Item
        as='a'
        className={activeFilter === 'week' ? 'active' : ''}
        onClick={() => this.setState({ activeFilter: 'week' })}
      >
        {t('common:thisWeek')}
      </List.Item>
      <List.Item
        as='a'
        className={activeFilter === 'month' ? 'active' : ''}
        onClick={() => this.setState({ activeFilter: 'month' })}
      >
        {t('common:thisMonth')}
      </List.Item>
    </List>

    return (
      <Container>
        <SEO
          schema='ItemList'
          title={`${t('seoBestPostTitle')} · MO.ST`}
          description={`${t('seoBestPostDesc')} · MO.ST`}
          path={'/best'}
          contentType='website'
        />
        {!isMobile()
          ? <Grid columns={2} className='post-list-wrapper'>
            <Grid.Column width={12}>
              <div className='ui segment'>
                {filters}
                <PostsList type='popular' duration={activeFilter} showStories withImage />
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <Sidebar />
            </Grid.Column>
          </Grid>
          : <Grid columns={1} className='post-list-wrapper'>
            <Grid.Column width={16}>
              <div className='ui segment'>
                {filters}
                <PostsList type='popular' duration={activeFilter} showStories withImage />
              </div>
            </Grid.Column>
          </Grid>
        }
      </Container>
    )
  }
}

export default translate('post')(NewPosts)
