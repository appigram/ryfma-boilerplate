import React from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import TimeAgoExt from '../Common/TimeAgoExt'
import { Feed } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const NotificationsListComponent = ({ data, t }) => {
  if (data.loading) {
    return <Feed className='loading-event' size='small'>
      <Feed.Event>
        <Feed.Content>
          <Feed.Summary>
            Loading...
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    </Feed>
  }

  if (data.error) {
    return <div>Error: { data.error.message }</div>
  }

  if (data.notifications.length === 0) {
    return (<div className='no-content'>
      {t('noNotifs')}
    </div>)
  }

  return (
    <div className='notif-menu-wrapper'>
      {data.notifications.map((notif, index) => {
        const notifTextTrans = notif.text.replace(/\s/ig, '')
        const notifText = t(notifTextTrans)
        const avatarImg = notif.author.profile.image ? notif.author.profile.image.replace('_full_', '_small_') : notif.author.profile.image
        return (
          <Feed key={notif._id} size='small'>
            <Feed.Event>
              <Feed.Label>
                <img src={avatarImg} alt={notif.author.profile.name} />
              </Feed.Label>
              <Feed.Content>
                <Feed.Date><TimeAgoExt date={notif.createdAt} /></Feed.Date>
                <Feed.Summary>
                  <Link to={`/u/${notif.author.username}`}>{notif.author.profile.name}</Link> {notifText} <Link to={`/p/${notif.objectId}`}>{notif.objectName}</Link>
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        )
      })
      }
    </div>
  )
}

const getLatestNotificatons = gql`
  query getLatestNotificatons {
    notifications {
      _id
      createdAt
      currId
      userId
      author {
        _id
        username
        profile {
          name
          image
        }
      }
      text
      notifType
      objectId
      objectName
    }
  }
`

const NotificationsList = graphql(getLatestNotificatons, {
  options: (ownProps) => ({
    fetchPolicy: 'network-only'
  })
})(NotificationsListComponent)

export default translate('notification')(NotificationsList)
