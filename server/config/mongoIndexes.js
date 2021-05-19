import { Meteor } from 'meteor/meteor'
import Albums from '/server/api/collections/Albums'
import Asks from '/server/api/collections/Asks'
import AudioFiles from '/server/api/collections/AudioFiles'
import Books from '/server/api/collections/Books'
import BookChapters from '/server/api/collections/BookChapters'
import BookShelves from '/server/api/collections/BookShelves'
import Comments from '/server/api/collections/Comments'
import Festivals from '/server/api/collections/Festivals'
import FestPosts from '/server/api/collections/FestPosts'
import Followers from '/server/api/collections/Followers'
import GiftItems from '/server/api/collections/GiftItems'
import Gifts from '/server/api/collections/GiftItems'
import Events from '/server/api/collections/Events'
import Memberships from '/server/api/collections/Memberships'
import Messages from '/server/api/collections/Messages'
import Notifications from '/server/api/collections/Notifications'
import Posts from '/server/api/collections/Posts'
import Promotions from '/server/api/collections/Promotions'
import Pushes from '/server/api/collections/Pushes'
import Rooms from '/server/api/collections/Rooms'
import Tags from '/server/api/collections/Tags'
import Users from '/server/api/collections/Users'

import Rhymes from '/server/api/collections/Rhymes'

// DROP INDEXES
const dropAllIndexes = () => {
  console.log('DROP MONGODB INDEXES START')
  console.time('DROP_INDEXES')
  Asks.rawCollection().dropIndexes()
  Albums.rawCollection().dropIndexes()
  AudioFiles.rawCollection().dropIndexes()

  BookChapters.rawCollection().dropIndexes()
  Books.rawCollection().dropIndexes()
  BookShelves.rawCollection().dropIndexes()

  Comments.rawCollection().dropIndexes()

  Festivals.rawCollection().dropIndexes()
  FestPosts.rawCollection().dropIndexes()
  Followers.rawCollection().dropIndexes()

  GiftItems.rawCollection().dropIndexes()
  Gifts.rawCollection().dropIndexes()

  Memberships.rawCollection().dropIndexes()
  Messages.rawCollection().dropIndexes()

  Notifications.rawCollection().dropIndexes()

  Posts.rawCollection().dropIndexes()
  Promotions.rawCollection().dropIndexes()
  Pushes.rawCollection().dropIndexes()

  Rhymes.rawCollection().dropIndexes()
  Rooms.rawCollection().dropIndexes()

  Tags.rawCollection().dropIndexes()

  Users.rawCollection().dropIndexes()
  console.timeEnd('DROP_INDEXES')
  console.log('DROP MONGODB INDEXES END')
}

const createIndexes = () => {
  // Users._getIndexes()

  console.log('CREATE MONGODB INDEXES START')
  console.time('CREATE_INDEXES')

  Asks._ensureIndex({ userId: 1 })
  Asks._ensureIndex({ createdAt: -1 })
  Asks._ensureIndex({ commentsCount: 1, createdAt: -1 })

  Albums._ensureIndex({ userId: 1, postCount: -1 })
  Albums._ensureIndex({ userId: 1, updatedAt: -1 })
  Albums._ensureIndex({ createdAt: -1 })

  AudioFiles._ensureIndex({ userId: 1 })

  Books._ensureIndex({ userId: 1 })
  Books._ensureIndex({ createdAt: -1 })
  Books._ensureIndex({ likersCount: -1 })
  Books._ensureIndex({ viewCount: -1 })
  Books._ensureIndex({ commentCount: -1 })
  Books._ensureIndex({ title: -1 })
  Books._ensureIndex({ rating: -1 })
  Books._ensureIndex({ savedCount: -1 })
  Books._ensureIndex({ updatedAt: -1 })
  Books._ensureIndex({ price: 1 })
  Books._ensureIndex({ genres: 1 })
  Books._ensureIndex({ genres: 1, createdAt: -1 })
  Books._ensureIndex({ genres: 1, likersCount: -1 })
  Books._ensureIndex({ genres: 1, viewCount: -1 })
  Books._ensureIndex({ genres: 1, commentCount: -1 })
  Books._ensureIndex({ genres: 1, title: -1 })
  Books._ensureIndex({ genres: 1, rating: -1 })
  Books._ensureIndex({ genres: 1, savedCount: -1 })
  Books._ensureIndex({ genres: 1, updatedAt: -1 })

  BookChapters._ensureIndex({ bookId: 1, chapterNum: 1 })

  BookShelves._ensureIndex({ userId: 1 })

  Comments._ensureIndex({ objectId: 1, createdAt: -1 })
  Comments._ensureIndex({ objectType: 1, createdAt: -1 })
  Comments._ensureIndex({ userId: 1, createdAt: -1 })

  Followers._ensureIndex({ currId: 1 })
  Followers._ensureIndex({ userId: 1 })

  Festivals._ensureIndex({ slug: 1 })
  Festivals._ensureIndex({ _id: 1, isDuel: 1 })
  Festivals._ensureIndex({ createdAt: -1 })

  FestPosts._ensureIndex({ createdAt: -1 })
  FestPosts._ensureIndex({ festId: 1, likeCount: -1, levels: 1 })
  FestPosts._ensureIndex({ festId: 1, juryCount: -1, levels: 1 })
  FestPosts._ensureIndex({ festId: 1, 'juryRating.userId': 1 })
  FestPosts._ensureIndex({ festId: 1, juryRating: 1, juryCount: 1 })

  Events._ensureIndex({ toDate: 1 })

  Gifts._ensureIndex({ toUserId: 1 })
  Gifts._ensureIndex({ objectId: 1, objectType: 1 })

  Memberships._ensureIndex({ ownerId: 1, price: -1 })

  Messages._ensureIndex({ roomId: 1, createdAt: 1 })

  Notifications._ensureIndex({ currId: 1 })
  Notifications._ensureIndex({ notifObjectId: 1 })
  Notifications._ensureIndex({ objectId: 1 })
  Notifications._ensureIndex({ createdAt: -1 })
  Notifications._ensureIndex({ userId: 1, createdAt: -1 })

  // User feeds
  Posts._ensureIndex({ userId: 1 })

  // Albums
  Posts._ensureIndex({ albumId: 1 })

  // Tags && Related posts
  Posts._ensureIndex({ tags: 1, commentsCount: -1 })
  Posts._ensureIndex({ tags: 1, createdAt: -1 })
  Posts._ensureIndex({ tags: 1, likeCount: -1 })
  Posts._ensureIndex({ tags: 1, viewCount: -1 })

  //Fests
  Posts._ensureIndex({ fests: 1, postedAt: -1 })

  // Common feeds
  Posts._ensureIndex({ createdAt: -1, isPromoted: 1, status: 1, coverImg: 1 })
  Posts._ensureIndex({ likeCount: -1, isPromoted: 1, status: 1, coverImg: 1 })
  Posts._ensureIndex({ viewCount: -1, isPromoted: 1, status: 1, coverImg: 1 })
  Posts._ensureIndex({ commentsCount: -1, isPromoted: 1, status: 1, coverImg: 1 })

  Posts._ensureIndex({ title: 1 })
  Posts._ensureIndex({ userId: 1, title: 1 })

  // Turbo XML API
  Posts._ensureIndex({ postedAt: -1, status: 1, paymentType: 1 })

  Promotions._ensureIndex({ userId: 1 })
  Promotions._ensureIndex({ objectType: 1 })
  Promotions._ensureIndex({ createdAt: -1 })
  Promotions._ensureIndex({ objectId: 1, objectType: 1 })

  Rhymes._ensureIndex({ word: 'text' }, { default_language: 'russian' })
  Rhymes._ensureIndex({ countUsed: -1 })

  Tags._ensureIndex({ createdAt: -1 })
  Tags._ensureIndex({ slug: 1 })
  Tags._ensureIndex({ count: -1 })

  Users._ensureIndex({ username: 1 })
  Users._ensureIndex({ userId: 1 })
  Users._ensureIndex({ createdAt: -1 })
  Users._ensureIndex({ isClassic: 1, 'profile.nextKarma': -1, isDeleted: 1 })
  Users._ensureIndex({ 'profile.name': 1 })
  Users._ensureIndex({ 'profile.unreadMessages': 1 })
  Users._ensureIndex({ 'stats.booksCount': -1 })
  Users._ensureIndex({ lastDateAt: -1 })
  // Recommended Users
  Users._ensureIndex({ roles: 1, 'stats.postsCount': 1 })
  Users._ensureIndex({ 'profile.nextKarma': 1, 'stats.postsCount': 1 })

  console.timeEnd('CREATE_INDEXES')
  console.log('CREATE MONGODB INDEXES END')
}

Meteor.startup(function () {
  // dropAllIndexes()

  // createIndexes()
})
