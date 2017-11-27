import React from 'react'
// import { Roles } from 'meteor/nicolaslopezj:roles'
import { isMobile, isTablet } from '/lib/utils/deviceDetect'
import store from '/lib/store'
// import withCurrentUser from './withCurrentUser'

export const authenticated = (Component) => {
  const loggingIn = Meteor.loggingIn() && !store.getItem('Meteor.loginToken')
  const authenticated = !loggingIn && !!Meteor.userId()
  const isAdmin = false // Roles.userIsInRole(Meteor.userId(), ["admin"])
  const checkMobile = isMobile()
  const checkTablet = isTablet()

  return (props) => <Component
    loggingIn={loggingIn}
    authenticated={authenticated}
    isAdmin={isAdmin}
    isMobile={checkMobile}
    isTablet={checkTablet}
    location={window.location}
    {...props}
  />
}

export default authenticated
