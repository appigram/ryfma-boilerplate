import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { translate } from 'react-i18next'
import { Container, Grid, Item, Icon } from 'semantic-ui-react'
import Loader from '../Common/Loader'
import SEO from '../Common/SEO'
import UserProfileInfo from './UserProfileInfo'
import UserProfileMenu from './UserProfileMenu'
import UserSidebar from './UserSidebar'
import UserSaved from './UserSaved'
import UserFollowing from './UserFollowing'
import UserFollowers from './UserFollowers'
import UserLatestPosts from './UserLatestPosts'
import { isMobile } from '/lib/utils/deviceDetect'
import store from '/lib/store'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const { Content } = Item

class UserPage extends React.Component {
  render () {
    const { data, t } = this.props

    if (data.loading) {
      return <Loader />
    }

    if (data.error) {
      return <Container>
        <SEO
          schema='ProfilePage'
          title={t('userNotFoundTitle')}
          description={t('userNotFoundDesc')}
          path={`u/${this.props.match.params.username}`}
          contentType='profile'
        />
        <Item className='user-page not-found-content'>
          <Content>
            <Icon name='user delete' />
            <h1>{t('userNotFoundTitle')}</h1>
            <p>{t('userNotFoundDesc')}</p>
            <Link to='/'>{t('userNotFoundLink')}</Link>
          </Content>
        </Item>
      </Container>
    }

    const user = data.getUser
    const currUserId = store.getItem('Meteor.userId')
    const props = {
      ...this.props,
      user
    }

    const userPage = this.props.location.pathname.split('/')[3]
    let children = <UserLatestPosts {...props} />

    if (userPage === 'saved' && currUserId === user._id) {
      children = <UserSaved {...props} />
    } else if (userPage === 'following') {
      children = <UserFollowing {...props} />
    } else if (userPage === 'followers') {
      children = <UserFollowers {...props} />
    }
    const userProfileName = user.profile.name.split(' ')
    return (
      <Container>
        <SEO
          schema='ProfilePage'
          title={user.profile.name + ' ·  MO.ST'}
          description={user.profile.bio}
          path={`u/${user.username}`}
          contentType='profile'
          first_name={user.firstname || userProfileName[0]}
          last_name={user.lastname || userProfileName[1]}
          username={user.username}
          tags={t('common:home.seoKeywords') + user.username}
          twitter={user.profile.twitterUser}
        />
        <Item className='user-page'>
          <Content>
            <UserProfileInfo currentUserId={currUserId} user={user} />
            <UserProfileMenu
              stats={user.stats}
              currentUserId={currUserId}
              userId={user._id}
              username={user.username}
              isFollowing={user.isFollowing}
              followUser={this.followUser}
              unFollowUser={this.unFollowUser}
            />
          </Content>
        </Item>
      </Container>
    )
  }
}

const getUser = gql`
  query getUser($username: String!) {
    getUser(username: $username) {
      _id
      username
      isFollowing
      profile {
        name
        firstname
        lastname
        bio
        website
        twitterUser
        instagramUser
        vkUser
        facebookUser
        image
      }
      stats {
        postsCount
        followersCount
        followingCount
        savedCount
      }
    }
  }
`

const UserPageWithData = graphql(getUser, {
  options: (ownProps) => ({
    variables: {
      username: ownProps.match.params.username
    },
    fetchPolicy: 'cache-and-network'
  })
})(UserPage)

export default translate('user')(withRouter(UserPageWithData))
