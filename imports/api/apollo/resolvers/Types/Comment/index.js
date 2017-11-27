import Users from '../../../../collections/Users'

export default {
  Comment: {
    author ({ userId }, _, context) {
      const options = {}
      // Query optimization
      options.fields = {
        _id: 1,
        roles: 1,
        username: 1,
        emails: 1,
        'profile.name': 1,
        'profile.image': 1
      }
      return Users.find({_id: userId}, options).fetch()[0]
    }
  }
}
