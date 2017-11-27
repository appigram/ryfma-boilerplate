import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import LazyLoad from 'react-lazyload'
import {Notification} from '../Notification/Notification'
import { Item, Button, Icon } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import ReactGA from 'react-ga'

class UserInfoItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isFollowing: this.props.user.isFollowing
    }
  }

  async followUser () {
    try {
      const followed = await this.props.followUser({ _id: this.props.user._id })
      ReactGA.event({
        category: 'User',
        action: 'FollowUser',
        value: this.props.user._id
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
      const unFollowed = await this.props.unFollowUser({ _id: this.props.user._id })
      ReactGA.event({
        category: 'User',
        action: 'UnFollowUser',
        value: this.props.user._id
      })
      this.setState({
        isFollowing: !unFollowed
      })
    } catch (error) {
      Notification.error(error)
    }
  }

  render () {
    const { user, type, itsme, isPost } = this.props
    const { isFollowing } = this.state
    const userImage = user.profile.image ? user.profile.image.replace('_full_', '_middle_') : null
    let userBadge = null

    return (
      <Item.Group relaxed={type !== 'small'}>
        <Item className={type === 'small' ? 'user-info small' : 'user-info'}>
          <Link className='user-info-link' rel='author' to={`/u/${user.username}`}>
            <LazyLoad height={60} offset={200} once placeholder={<div className='ui tiny avatar image img-placeholder' />}>
              <Item.Image avatar size='tiny' src={userImage} />
            </LazyLoad>
            {userBadge}
          </Link>
          <Item.Content verticalAlign='middle'>
            <div className='user-info-content'>
              <Item.Header itemProp='author' itemScope itemType='https://schema.org/Person'>
                <Link rel='author' itemProp='url' to={`/u/${user.username}`}><span itemProp='name'>{user.profile.name}</span></Link>
              </Item.Header>
              <Item.Description itemProp='disambiguatingDescription'>
                {user.profile.bio}
              </Item.Description>
            </div>
            { type === 'small' || itsme
              ? null
              : (isFollowing
                ? <Button
                  basic
                  color='grey'
                  className='follow'
                  onClick={this.unFollowUser.bind(this)}
                >
                  Unfollow
                </Button>
                : <Button
                  color='green'
                  className='follow'
                  onClick={this.followUser.bind(this)}
                >
                  Follow
                </Button>
              )
            }
          </Item.Content>
        </Item>
      </Item.Group>
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

const UserInfoItemWithData = compose(
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
)(UserInfoItem)

export default withRouter(UserInfoItemWithData)
