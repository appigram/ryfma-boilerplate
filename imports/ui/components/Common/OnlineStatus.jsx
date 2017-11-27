import React from 'react'
import { Session } from 'meteor/session'
import { UserStatus } from 'meteor/ostrio:user-status'

const OnlineStatus = () => {
  let userStatus = <span className='user-status offline' />
  if (UserStatus.status.get() === 'online') {
    userStatus = <span className='user-status online' />
  } else if (UserStatus.status.get() === 'idle' || Session.get('UserStatusIdle')) {
    userStatus = <span className='user-status idle' />
  }
  return userStatus
}

export default OnlineStatus
