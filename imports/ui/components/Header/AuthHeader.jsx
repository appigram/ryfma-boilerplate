import React from 'react'
import { translate } from 'react-i18next'
import { withApollo } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
import { Icon, Image, Label, Dropdown } from 'semantic-ui-react'
import LazyLoad from 'react-lazyload'
import { logout } from '../Common/meteor-apollo-accounts'
import NotificationsList from '../Notifications/NotificationsList'
import {Notification} from '../Notification/Notification'
import store from '/lib/store'
import ReactGA from 'react-ga'

// container
import withCurrentUser from '/imports/ui/containers/withCurrentUser'

class AuthNavigationComponent extends React.Component {
  constructor (params) {
    super(params)
    this.state = {
      openNotifs: false,
      clearedNotifs: false
    }
  }

  async logout (event) {
    event.preventDefault()
    store.removeItem('Meteor.currUser')
    this.props.cookies.remove('meteor_login_token', { path: '/' })
    try {
      await logout(this.props.client)
      ReactGA.event({
        category: 'User',
        action: 'LogOut'
      })
      Notification.success(this.props.t('common:notif.logOut'))
      this.props.history.push('/')
      // this.props.client.resetStore()
    } catch (error) {
      store.removeItem('Meteor.loginToken')
      Notification.error(error)
    }
  }

  startWritingNewPost = () => {
    ReactGA.event({
      category: 'User',
      action: 'PostStartWriting',
      value: this.props.data.me._id
    })
  }

  render () {
    const { data, isTablet, isMobile, t } = this.props

    if (data.loading) {
      return <div />
    }

    const currUser = data.me
    store.setItem('Meteor.currUser', JSON.stringify(currUser))

    let userBadge = null

    return (
      <div>
        {!isMobile && <Link to='/new-post' className='new-post-button button' onClick={() => this.startWritingNewPost}>
          {isTablet
            ? <Icon name='pencil' />
            : t('common:header.newPost')
          }
        </Link>}
        {/* <Link className='messages-menu' to='/messages'><Icon size='large' name='chat' /></Link> */}
        {!isMobile && <Dropdown
          className='notif-topmenu'
          pointing='top right'
          open={this.state.openNotifs}
          onOpen={() => this.setState({ openNotifs: true, clearedNotifs: true })}
          onClose={() => this.setState({ openNotifs: false })}
          onBlur={() => this.setState({ openNotifs: false })}
          icon={null}
          trigger={
            <span>
              <Icon size='large' name='bell outline' />
              {currUser.profile.unreadNotifications && !this.state.clearedNotifs && <Label size='mini' color='red' empty circular floating />}
            </span>
          }
        >
          <Dropdown.Menu className='notif-menu'>
            {this.state.openNotifs ? <NotificationsList /> : null}
          </Dropdown.Menu>
        </Dropdown>}
        <Dropdown
          upward={isMobile}
          pointing='top right'
          icon={null}
          trigger={
            <span className='user-topmenu'>
              {
                currUser.profile.image
                ?
                <LazyLoad height={60} once placeholder={<div className='ui avatar image img-placeholder' />}>
                  <Image avatar src={currUser.profile.image.replace('_full_', '_small_')} alt={currUser.profile.name} />
                </LazyLoad>

                : <Icon size='large' name='user outline' alt={currUser.profile.name} />
              }
              {userBadge}
              <Icon name='dropdown' />
            </span>
          }
        >
          <Dropdown.Menu className='user-menu'>
            <Dropdown.Item>
              <Link to={`/u/${currUser.username}`}>
                <Icon name='user' />
                {t('common:header.myProfile')}
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to={`/me`}>
                <Icon name='settings' />
                {t('common:header.settings')}
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to={`/me/invites`}>
                <Icon name='mail' />
                {t('common:header.invites')}
              </Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              className='sign-out'
              icon='sign out'
              text={t('common:form.signOut')}
              onClick={this.logout.bind(this)} />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

export default translate()(withApollo(withRouter(withCurrentUser(AuthNavigationComponent))))
