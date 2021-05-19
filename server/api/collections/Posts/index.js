

import { Mongo } from 'meteor/mongo'
import PostSchema from './Schema'

const Posts = new Mongo.Collection('posts')

Posts.attachSchema(PostSchema)

export default Posts
