import { Meteor } from 'meteor/meteor'
import { Slingshot } from 'meteor/edgee:slingshot'

const checkUserUploadPermissions = (metaContext, userId) => {
  if (metaContext.userId) {
    const user = Meteor.users.findOne(metaContext.userId)

    // Denied if user doesn't exist or if it is not owned by the current user.
    if (user && user.userId === userId) {
      return true
    } else {
      const message = 'You can upload images to your own account only'
      throw new Meteor.Error('Login Required', message)
    }
  }
  if (!userId) {
    const message = 'Please login before set user images'
    throw new Meteor.Error('Login Required', message)
  } else {
    return true
  }
}

const userImageSettings = {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 2 * 1024 * 1024 // 2 MB (use null for unlimited)
}

const userImageDirectiveSettings = {
  bucket: Meteor.settings.AWSBucket,
  acl: 'public-read',
  maxSize: 2 * 1024 * 1024,
  cacheControl: 'public,max-age=29030400',
  allowedFileTypes: ['image/png', 'image/jpg', 'image/jpeg'],
  authorize: function (file, metaContext) {
    return checkUserUploadPermissions(metaContext, this.userId)
  },
  key: function (file, metaContext) {
    // Store file into a directory by the user's username.
    const filename = metaContext.filename.replace(/\.[^/.]+$/, '')
    const filenamePrefix = metaContext.filenamePrefix
    return 'images/' + this.userId + '/users/' + filenamePrefix + metaContext.time + '_' + filename + '.jpg'
  }
}

Slingshot.fileRestrictions('userFullImage', userImageSettings)
Slingshot.fileRestrictions('userMiddleImage', userImageSettings)
Slingshot.fileRestrictions('userSmallImage', userImageSettings)

Slingshot.createDirective('userFullImage', Slingshot.S3Storage, userImageDirectiveSettings)
Slingshot.createDirective('userMiddleImage', Slingshot.S3Storage, userImageDirectiveSettings)
Slingshot.createDirective('userSmallImage', Slingshot.S3Storage, userImageDirectiveSettings)
