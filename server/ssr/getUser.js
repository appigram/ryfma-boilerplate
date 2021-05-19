const getUser = (authContext) => {
  let userState = null
  if (authContext.token && authContext.currUser) {
    const userStore = authContext.currUser || null
    // delete userStore.services
    delete userStore.paymentKey
    delete userStore.pushSubs
    // delete userStore.rooms
    delete userStore.connection
    // delete userStore.createdAt
    // delete userStore.profile.events
    // delete userStore.profile.rooms
    // delete userStore.profile.fests
    // delete userStore.profile.following
    // delete userStore.profile.saved
    // console.log('userStore: ', userStore)
    try {
      userState = userStore ? JSON.stringify(userStore) : null
    } catch (err) {
      // console.log('userState: ', userState)
      console.log(err)
    }
  }
  return { user: userState }
}

export default getUser
