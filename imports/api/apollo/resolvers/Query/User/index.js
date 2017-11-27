// import { Roles } from 'meteor/nicolaslopezj:roles';
import adminUsers from './adminUsers'
import adminStat from './adminStat'
import me from './me'
import { getUser, getFollowers, getFollowing, getSaved } from './user'
import users from './users'
import suggestedUsers from './suggestedUsers'

export default {
  adminUsers,
  adminStat,
  me,
  suggestedUsers,
  getUser,
  getFollowers,
  getFollowing,
  getSaved,
  users
}
