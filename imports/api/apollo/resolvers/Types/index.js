import User from './User'
import Post from './Post'
import Comment from './Comment'
import Notification from './Notification'

export default {
  ...User,
  ...Post,
  ...Comment,
  ...Notification
}
