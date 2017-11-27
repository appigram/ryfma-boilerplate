import { Meteor } from 'meteor/meteor'
import { Slingshot } from 'meteor/edgee:slingshot'
import Posts from '../../api/collections/Posts'

const checkPostUploadPermissions = (metaContext, userId) => {
  if (metaContext.postId) {
    const post = Posts.findOne(metaContext.postId)

    // Denied if post doesn't exist or if it is not owned by the current user.
    if (post && post.userId === userId) {
      return true
    } else {
      const message = 'You can upload images to your own posts only'
      throw new Meteor.Error('Login Required', message)
    }
  }
  if (!userId) {
    const message = 'Please login before set post images'
    throw new Meteor.Error('Login Required', message)
  } else {
    return true
  }
}

const postImageSettings = {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 2 * 1024 * 1024 // 2 MB (use null for unlimited)
}

const postImageDirectiveSettings = {
  bucket: Meteor.settings.AWSBucket,
  acl: 'public-read',
  maxSize: 2 * 1024 * 1024,
  cacheControl: 'public,max-age=29030400',
  allowedFileTypes: ['image/png', 'image/jpg', 'image/jpeg'],
  authorize: function (file, metaContext) {
    return checkPostUploadPermissions(metaContext, this.userId)
  },
  key: function (file, metaContext) {
    // Store file into a directory by the user's username.
    const filename = metaContext.filename.replace(/\.[^/.]+$/, '')
    const filenamePrefix = metaContext.filenamePrefix
    return 'images/' + this.userId + '/posts/' + filenamePrefix + metaContext.time + '_' + filename + '.jpg'
  }
}

Slingshot.fileRestrictions('postFullImage', postImageSettings)
Slingshot.fileRestrictions('postMiddleImage', postImageSettings)
Slingshot.fileRestrictions('postSmallImage', postImageSettings)

Slingshot.createDirective('postFullImage', Slingshot.S3Storage, postImageDirectiveSettings)
Slingshot.createDirective('postMiddleImage', Slingshot.S3Storage, postImageDirectiveSettings)
Slingshot.createDirective('postSmallImage', Slingshot.S3Storage, postImageDirectiveSettings)
