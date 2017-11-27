import { Mongo } from 'meteor/mongo'
import NotificationSchema from './Schema.js'

const Notifications = new Mongo.Collection('notifications')

Notifications.attachSchema(NotificationSchema)

export default Notifications
