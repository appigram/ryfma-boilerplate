import { Meteor } from 'meteor/meteor'
// import Users from '../../../../../server/api/collections/Users'

const linkSocialService = Meteor.bindEnvironment((context, serviceName, serviceData, options, _id, services) => {
  /* console.log('context: ', context)
  console.log('serviceName: ', serviceName)
  console.log('serviceData: ', serviceData)
  console.log('options: ', options)
  console.log('_id: ', _id)
  console.log('services: ', services) */

  if (serviceName === 'password' || serviceName === 'resume') {
    throw new Meteor.Error("Can't use LinkUserFromExternalService with internal service: " + serviceName)
  }
  if (!(serviceData.hasOwnProperty('id') || serviceData.hasOwnProperty('userId'))) {
    throw new Meteor.Error("'id' missing from service data for: " + serviceName)
  }

  const user = context.user
  const userId = user ? user._id : _id

  // We probably throw an error instead of call update or create here.
  if (!userId) return new Meteor.Error('You must be logged in to use LinkUserFromExternalService')

  const checkExistingSelector = {}
  if (serviceData.userId) {
    serviceData.id = serviceData.userId
    delete serviceData.userId
  }
  checkExistingSelector['services.' + serviceName + '.id'] = serviceData.id

  const existingUsers = Meteor.users.find(checkExistingSelector).fetch()
  if (existingUsers.length) {
    existingUsers.forEach(function (existingUser) {
      if (existingUser._id !== userId) {
        throw new Meteor.Error('This social account is already in use by other user')
      }
    })
  }

  // we do not allow link another account from existing service.
  // XXX maybe we can override this?
  const userServices = user ? user.services : services
  if (userServices && userServices[serviceName] && userServices[serviceName].id !== serviceData.id) {
    return new Meteor.Error('User can link only one account to service: ' + serviceName)
  } else {
    const setAttrs = {}
    Object.keys(serviceData).forEach(key => {
      setAttrs['services.' + serviceName + '.' + key] = serviceData[key]
    })

    Meteor.users.update(userId, { $set: setAttrs })
    return {
      type: serviceName,
      userId: userId
    }
  }
})

export default linkSocialService
