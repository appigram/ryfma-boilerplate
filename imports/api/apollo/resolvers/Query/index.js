import User from './User'
import Post from './Post'
import Search from './Search'
import Notification from './Notification'
import Tag from './Tag'

export default {
  ...User,
  ...Post,
  ...Search,
  ...Notification,
  ...Tag
}
