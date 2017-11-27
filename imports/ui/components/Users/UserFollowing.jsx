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

const getFollowing = gql`
  query getFollowing($username: String!, $skip: Int, $limit: Int) {
    getFollowing(username: $username, skip: $skip, limit: $limit) {
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

class UserFollowing extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      skipUsers: 0,
      following: [],
      infinityLoading: true
    }
  }

  getFollowingData = () => {
    return this.state.following.length > 0 ? this.state.following : this.props.data.getFollowing
  }

  fetchMoreUsers = (skipUsers) => {
    const following = this.getFollowingData()
    this.props.client.query({
      query: getFollowing,
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
        // Update following data
        if (data.getFollowing) {
          this.setState({
            skipUsers,
            following: [...following, ...data.getFollowing],
            infinityLoading: data.getFollowing.length === 1
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

    const getFollowingUsers = this.getFollowingData()
    const currUserId = store.getItem('Meteor.userId')
    return (
      <Container>
        <div className='ui segment user-list'>
          { getFollowingUsers.length > 0
            ? getFollowingUsers.map((user) =>
              <UserInfoItem user={user} />
            )
            : <EmptyBlock iconName='users' header={t('noFollowing')} text={!currUserId
              ? t('noFollowingUserText')
              : (currUserId === this.props.user._id ? t('noFollowingMeText') : t('noFollowingUserText')
              )
            } />
          }
          {this.state.infinityLoading && getFollowingUsers.length > 20
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

const UserFollowingWithData = graphql(getFollowing, {
  options: (ownProps) => ({
    variables: {
      username: ownProps.match.params.username,
      skip: ownProps.skip || 0,
      limit: 20
    },
    activeCache: true
  })
})(UserFollowing)

export default translate('user')(withApollo(withRouter(UserFollowingWithData)))
