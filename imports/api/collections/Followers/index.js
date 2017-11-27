import { Mongo } from 'meteor/mongo'
import FollowerSchema from './Schema.js'

const Followers = new Mongo.Collection('followers')

Followers.attachSchema(FollowerSchema)

export default Followers
