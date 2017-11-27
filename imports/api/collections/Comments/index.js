import { Mongo } from 'meteor/mongo'
import CommentSchema from './Schema.js'

const Comments = new Mongo.Collection('comments')

Comments.attachSchema(CommentSchema)

export default Comments
