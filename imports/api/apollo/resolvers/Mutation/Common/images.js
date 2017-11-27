import { Meteor } from 'meteor/meteor'
import Posts from '../../../../collections/Posts'
const AWS = require('aws-sdk')

AWS.config = new AWS.Config()

AWS.config.accessKeyId = Meteor.settings.AWSAccessKeyId
AWS.config.secretAccessKey = Meteor.settings.AWSSecretAccessKey
AWS.config.region = Meteor.settings.AWSRegion

const s3 = new AWS.S3()

const updateCollection = Meteor.bindEnvironment(function (args) {
  if (args.type === 'post') {
    Posts.update({ '_id': args.objectId }, { $set: { 'coverImg': '' } })
  } else if (args.type === 'user') {
    Meteor.users.update({ '_id': args.objectId }, { $set: { 'profile.image': '' } })
  }
})

const removeImageFromS3 = (root, args, context) => {
  const { userId } = context || { userId: null }
  if (userId) {
    const imageToDelete = args.imgUrl.replace('https://cdnryfma.s3.amazonaws.com/', '')

    if (imageToDelete !== 'defaults/icons/default_full_avatar.jpg') {
      const params = {
        Bucket: Meteor.settings.AWSBucket,
        Delete: {
          Objects: [
            {
              Key: imageToDelete
            },
            {
              Key: imageToDelete.replace('_full_', '_middle_')
            },
            {
              Key: imageToDelete.replace('_full_', '_small_')
            }
          ]
        }
      }
      s3.deleteObjects(params, function (error, data) {
        if (error) {
          throw new Meteor.Error('S3-deleting-error', error)
        } else {
          if (!args.silent) {
            updateCollection(args)
          }
        }
      })
    }
    return true
  } else {
    throw new Meteor.Error('Login required', 'Insufficient rights for this action.')
  }
}

export { removeImageFromS3 }
