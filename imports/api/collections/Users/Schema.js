import SimpleSchema from 'simpl-schema'
import Profile from './Profile'
import Stats from './Stats'
import Settings from './Settings'

export default new SimpleSchema({
  username: {
    type: String
    // regEx: /^[a-z0-9A-Z_]{3,15}$/,
  },
  emails: {
    type: Array
  },
  'emails.$': {
    type: Object
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  'emails.$.verified': {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: Profile,
    defaultValue: {}
  },
  stats: {
    type: Stats,
    defaultValue: {}
  },
  settings: {
    type: Settings,
    defaultValue: {}
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: Array,
    optional: true
  },
  'roles.$': {
    type: String,
    optional: true
  },
  heartbeat: {
    type: Date,
    optional: true
  },
  connection: {
    type: String,
    optional: true
  }
})
