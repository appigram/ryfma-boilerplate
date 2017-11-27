import React from 'react'
import { translate } from 'react-i18next'
import { Container, List } from 'semantic-ui-react'
import PostsList from '../Posts/PostsList'

class UserLatestPosts extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeSort: 'latest'
    }
  }

  changeSort = (sortType) => {
    this.setState({
      activeSort: sortType
    })
  }

  render () {
    const { t } = this.props
    const { activeSort } = this.state
    return (
      <Container>
        <div className='ui segment user-posts'>
          <List className='list-actions' link horizontal>
            <List.Item>
              {t('common:sortBy')}
            </List.Item>
            <List.Item
              as='a'
              className={activeSort === 'latest' ? 'active' : ''}
              onClick={() => this.changeSort('latest')}
            >
              {t('common:latest')}
            </List.Item>
            <List.Item
              as='a'
              className={activeSort === 'popular' ? 'active' : ''}
              onClick={() => this.changeSort('popular')}
            >
              {t('common:popular')}
            </List.Item>
            <List.Item
              as='a'
              className={activeSort === 'viewed' ? 'active' : ''}
              onClick={() => this.changeSort('viewed')}
            >
              {t('common:mostViewed')}
            </List.Item>
            <List.Item
              as='a'
              className={activeSort === 'commented' ? 'active' : ''}
              onClick={() => this.changeSort('commented')}
            >
              {t('common:mostCommented')}
            </List.Item>
          </List>
          <PostsList
            type={activeSort}
            shortPost={this.props.shortPost}
            showAds={false}
            userId={this.props.user._id}
          />
        </div>
      </Container>
    )
  }
}

export default translate()(UserLatestPosts)
