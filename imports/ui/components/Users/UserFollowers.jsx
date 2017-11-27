import React from 'react'
import { translate } from 'react-i18next'
import { Container, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Common/Loader'
import {Notification} from '../Notification/Notification'
import UserInfoItem from '../Users/UserInfoItem'
import EmptyBlock from '../Common/EmptyBlock'
import store from '/lib/store'

const getFollowers = gql`
  query getFollowers($username: String!, $skip: Int, $limit: Int) {
    getFollowers(username: $username, skip: $skip, limit: $limit) {
      _id
      username
      isFollowing
      profile {
        name
        bio
        image
      }
    }
  }
`

class UserFollowers extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      skipUsers: 0,
      followers: [],
      infinityLoading: true
    }
  }

  getFollowersData = () => {
    return this.state.followers.length > 0 ? this.state.followers : this.props.data.getFollowers
  }

  fetchMoreUsers = (skipUsers) => {
    const followers = this.getFollowersData()
    this.props.client.query({
      query: getFollowers,
      variables: {
        username: this.props.match.params.username,
        skip: skipUsers,
        limit: 20
      }
    }).then((graphQLResult) => {
      const { errors, data } = graphQLResult

      if (errors) {
        if (errors.length > 0) {
          Notification.error(errors[0].message)
        }
      } else {
        // Update followers data
        if (data.getFollowers) {
          this.setState({
            skipUsers,
            followers: [...followers, ...data.getFollowers],
            infinityLoading: data.getFollowers.length === 1
          })
        }
      }
    }).catch((error) => {
      Notification.error(error.message)
    })
  }

  render () {
    const { t } = this.props
    const { loading, error } = this.props.data

    if (loading) {
      return <Loader />
    }

    if (error) {
      return <div>Error: {error.reason}</div>
    }
    const getFollowersUsers = this.getFollowersData()
    const currUserId = store.getItem('Meteor.userId')
    return (
      <Container>
        <div className='ui segment user-list'>
          { getFollowersUsers.length > 0
            ? getFollowersUsers.map((user) =>
              <UserInfoItem user={user} />
            )
            : <EmptyBlock iconName='users' header={t('noFollowers')} text={!currUserId
              ? t('noFollowersUserText')
              : (currUserId === this.props.user._id ? t('noFollowersMeText') : t('noFollowersUserText'))
            } />
          }
          {this.state.infinityLoading && getFollowersUsers.length > 20
            ? <div className='loadmore-button' onClick={() => this.fetchMoreUsers(this.state.skipUsers + 1)}>
              <Icon name='refresh' />
              {t('common:showMore')}
            </div>
            : null
          }
        </div>
      </Container>
    )
  }
}

const UserFollowersWithData = graphql(getFollowers, {
  options: (ownProps) => ({
    variables: {
      username: ownProps.match.params.username,
      skip: ownProps.skip || 0,
      limit: 20
    },
    activeCache: true
  })
})(UserFollowers)

export default translate('user')(withApollo(withRouter(UserFollowersWithData)))
