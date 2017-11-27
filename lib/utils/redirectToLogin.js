const redirectToLogin = (client) => {
  if (client) {
    console.log('Token is invalid. Redirect to login page')
    console.log('Reset store')
    window.localStorageExt.setItem('Meteor.loginToken', '')
    client.resetStore()
  }
}

export default redirectToLogin
