import React from 'react'
import { translate } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import {Notification} from '../Notification/Notification'
import { Container, Table, Button, Header } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import ReactGA from 'react-ga'

class UserProfileMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isFollowing: this.props.isFollowing
    }
  }

  async followUser () {
    try {
      const followed = await this.props.followUser({ _id: this.props.userId })
      ReactGA.event({
        category: 'User',
        action: 'FollowUser',
        value: this.props.userId
      })
      this.setState({
        isFollowing: followed
      })
    } catch (error) {
      Notification.error(error)
    }
  }

  async unFollowUser () {
    try {
      const unFollowed = await this.props.unFollowUser({ _id: this.props.userId })
      ReactGA.event({
        category: 'User',
        action: 'UnFollowUser',
        value: this.props.userId
      })

      this.setState({
        isFollowing: !unFollowed
      })
    } catch (error) {
      Notification.error(error)
    }
  }

  render () {
    const { stats, userId, username, currentUserId, t, location } = this.props
    const { isFollowing } = this.state
    return (
      <Container>
        <Table className='user-profile-menu'>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={6}>
                <Header as='h3' className={location.pathname === `/u/${username}` ? 'active' : ''}>
                  <Link to={`/u/${username}`}>
                    <Header.Content>
                      {stats.postsCount || 0}
                      <Header.Subheader>{t('posts')}</Header.Subheader>
                    </Header.Content>
                  </Link>
                </Header>
                {currentUserId === userId && <Header as='h3' className={location.pathname === `/u/${username}/saved` ? 'active' : ''}>
                  <Link to={`/u/${username}/saved`}>
                    <Header.Content>
                      {stats.savedCount || 0}
                      <Header.Subheader>{t('saved')}</Header.Subheader>
                    </Header.Content>
                  </Link>
                </Header>
                }
              </Table.Cell>
              <Table.Cell width={3} textAlign='center' className='user-profile-stat'>
                <Header as='h3' className={location.pathname === `/u/${username}/followers` ? 'active' : ''}>
                  <Link to={`/u/${username}/followers`}>
                    <Header.Content>
                      {stats.followersCount || 0}
                      <Header.Subheader>{t('followers')}</Header.Subheader>
                    </Header.Content>
                  </Link>
                </Header>
                <Header as='h3' className={location.pathname === `/u/${username}/following` ? 'active' : ''}>
                  <Link to={`/u/${username}/following`}>
                    <Header.Content>
                      {stats.followingCount || 0}
                      <Header.Subheader>{t('following')}</Header.Subheader>
                    </Header.Content>
                  </Link>
                </Header>
              </Table.Cell>
              {currentUserId !== userId
                ? <Table.Cell width={6} textAlign='right' className='user-profile-actions'>
                  {/* <Button color='blue' className='follow'>
                    Write message
                  </Button> */}
                  { isFollowing
                    ? <Button
                      basic
                      color='grey'
                      className='follow'
                      onClick={this.unFollowUser.bind(this)}
                    >
                      {t('unfollow')}
                    </Button>
                    : <Button
                      color='green'
                      className='follow'
                      onClick={this.followUser.bind(this)}
                    >
                      {t('follow')}
                    </Button>
                  }
                </Table.Cell>
                : <Table.Cell width={6} textAlign='right' className='user-profile-actions'>
                  <Button
                    basic
                    color='grey'
                    className='follow'
                    onClick={() => this.props.history.push('/me/profile')}
                  >
                    {t('editProfile')}
                  </Button>
                </Table.Cell>
              }
            </Table.Row>
          </Table.Body>
        </Table>
      </Container>
    )
  }
}

const followUser = gql`
  mutation followUser($_id: ID!) {
    followUser(
      _id: $_id
    )
  }
`

const unFollowUser = gql`
  mutation unFollowUser($_id: ID!) {
    unFollowUser(
      _id: $_id
    )
  }
`

const UserProfileMenuWithData = compose(
  graphql(followUser, {
    props ({ mutate }) {
      return {
        followUser ({_id}) {
          return mutate({ variables: { _id } })
        }
      }
    }
  }),
  graphql(unFollowUser, {
    props ({ mutate }) {
      return {
        unFollowUser ({_id}) {
          return mutate({ variables: { _id } })
        }
      }
    }
  })
)(UserProfileMenu)

export default translate('user')(withRouter(UserProfileMenuWithData))
