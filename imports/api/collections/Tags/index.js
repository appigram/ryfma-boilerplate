import { Mongo } from 'meteor/mongo'
import TagSchema from './Schema'

const Tags = new Mongo.Collection('tags')

Tags.attachSchema(TagSchema)

export default Tags
