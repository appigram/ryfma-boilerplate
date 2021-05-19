import dbCache from '/server/config/redis'
import Tags from '../../../../collections/Tags'
// import Comments from '../../../../collections/Comments'
import Albums from '../../../../collections/Albums'
import Users from '../../../../collections/Users'
import Promotions from '../../../../collections/Promotions'
import Certificates from '../../../../collections/Certificates'
import AudioFiles from '../../../../collections/AudioFiles'
import Festivals from '../../../../collections/Festivals'
import Gifts from '../../../../collections/Gifts'

export default {
  Post: {
    album: async ({ albumId }, _, context, { cacheControl }) => {
      if (albumId) {
        const getAlbum = await dbCache.get('album_' + albumId)
        if (getAlbum) {
          return getAlbum
        } else {
          const album = Albums.findOne(albumId)
          if (album) {
            dbCache.set('album_' + albumId, album)
          }
        return album
        }
      }
      return null
    },
    audios: ({ audioFiles }, _, context) => {
      const audioFilesArr = Array.isArray(audioFiles) ? audioFiles : [audioFiles]
      return AudioFiles.find({ _id: { $in: audioFilesArr } }).fetch() || []
    },
    author: async ({ _id, userId }, _, context, { cacheControl }) => {
      const getUser = await dbCache.get('user_' + userId)
      if (getUser) {
        return getUser
      } else {
        const author = Users.findOne({ _id: userId })
        if (author) {
          dbCache.set('user_' + userId, author)
        } else {
          return {
            _id: '_1',
            username: 'deleted',
            roles: ['normal'],
            emails: [
              {
                address: 'deleted@ryfma.com',
                verified: false
              }
            ],
            profile: {
              name: 'User deleted',
              image: 'https://cdn.ryfma.com/defaults/icons/default_full_avatar.jpg'
            }
          }
          // return null
        }
        return author
      }
    },
    tags: async ({ _id, tags }, _, context, { cacheControl }) => {
      if (tags) {
        const getTags = await dbCache.get('post_tags_' + _id)
        if (getTags) {
          return getTags
        } else {
          if (tags.length > 0) {
            const qTags = Tags.find({ _id: { $in: tags } }).fetch()
            if (qTags) {
              qTags.sort((a, b) => {
                // Sort docs by the order of their _id values in ids.
                return tags.indexOf(a._id) - tags.indexOf(b._id)
              })
              dbCache.set('post_tags_' + _id, qTags)
            }
            return qTags
          }
        }
      }
      return []
    },
    liked: ({ likers }, _, context) => {
      if (!context.userId) { return false }
      return context &&
        likers &&
        !!likers.find(u => typeof u === 'string' ? u === context.userId : u.userId === context.userId)
    },
    currUserLikes: ({ likers }, _, context, {cacheControl}) => {
      if (!context.userId) { return 0 }
      if (context && likers) {
        const user = likers.find(u => u.userId === context.userId)
        if (user) {
          return user.likes || 1 // fallback to one like
        } else {
          const user = likers.find(u => u === context.userId)
          if (user) {
            return 1
          }
        }
      }
      return 0
    },
    saved: ({ savers }, _, context, { cacheControl }) => {
      if (!context.userId) { return false }
      return context &&
        savers &&
        !!savers.find(u => typeof u === 'string' ? u === context.userId : u._id === context.userId)
    },
    isBought: ({ buyers }, _, context, { cacheControl }) => {
      if (!context.userId) { return false }
      return context &&
        buyers &&
        !!buyers.find(u => typeof u === 'string' ? u === context.userId : u._id === context.userId)
    },
    promo: async ({ _id }, _, context, { cacheControl }) => {
      const getPromoStat = await dbCache.get('post_promo_' + _id)
      if (getPromoStat) {
        if (getPromoStat.currentViews % 30 > 5) {
          const promos = Promotions.find({ objectId: _id }).fetch()
          if (promos) {
            if (promos.length > 1) {
              let promo = promos[0]
              for (let i = 1; i < promos.length; i++) {
                promo.currentViews += promos[i].currentViews
                promo.totalViews += promos[i].totalViews
                if (promos[i].isActive) {
                  promo.status = promos[i].status
                }
              }
              dbCache.set('post_promo_' + _id, promo)
              return promo
            } else {
              if (promos[0]) {
                dbCache.set('post_promo_' + _id, promos[0])
              }
              return promos[0]
            }
          }
          return promos
        }
        return getPromoStat
      } else {
        let promos = Promotions.find({ objectId: _id }).fetch()
        if (promos) {
          if (promos.length > 1) {
            let promo = promos[0]
            for (let i = 1; i < promos.length; i++) {
              promo.currentViews += promos[i].currentViews
              promo.totalViews += promos[i].totalViews
              if (promos[i].isActive) {
                promo.status = promos[i].status
              }
            }
            dbCache.set('post_promo_' + _id, promo)
            return promo
          } else {
            if (promos[0]) {
              dbCache.set('post_promo_' + _id, promos[0])
            }
            return promos[0]
          }
        }
        return promos
      }
    },
    certificate: async ({ _id }, _, context, { cacheControl }) => {
      const getCert = await dbCache.get('cert_' + _id)
      if (getCert) {
        return getCert
      } else {
        const cert = Certificates.findOne({ postId: _id })
        if (cert) {
            dbCache.set('cert_' + _id, cert)
        }
        return cert
      }
    },
    isBlocked: async ({ userId }, _, context, { cacheControl }) => {
      // console.log('context time: ', new Date())
      // console.log('context: ', context.userId)
      if (context.userId) {
        const isBlocked = await dbCache.get('isBlocked_' + userId + '_' + context.userId)
        // console.log('isBlocked Cache: ', isBlocked)
        if (isBlocked) {
          return isBlocked
        } else {
          const user = Users.findOne({ _id: userId }, { fields: { blackList: 1 } })
          if (user) {
            const inBlackList = user.blackList ? user.blackList.find(u => u === context.userId) : false
            if (inBlackList) {
              dbCache.set('isBlocked_' + userId + '_' + context.userId, true)
            }
            return inBlackList
          }
        }
      }
      return false
    },
    inFests: async ({ _id, fests }, _, context, { cacheControl }) => {
      if (fests) {
        const getInFests = await dbCache.get('post_fests_' + _id)
        if (getInFests) {
          return getInFests
        } else {
          if (fests.length > 0) {
            const inFests = Festivals.find({ _id: { $in: fests } }, { sort: { createdAt: -1 }, fields: { _id: 1, slug: 1, title: 1, isDuel: 1 } }).fetch()
            if (inFests) {
              dbCache.set('post_fests_' + _id, inFests)
            }
            return inFests
          }
        }
      }
      return []
    },
    gifts: async ({ _id }, _, context, { cacheControl }) => {
      const getGifts = await dbCache.get('gifts_post_' + _id)
      if (getGifts) {
        return getGifts
      } else {
        const gift = Gifts.findOne({ objectId: _id, objectType: 'post' })
        if (gift) {
          dbCache.set('gifts_post_' + _id, gift)
          return gift
        }
      }
      return null
    },
    promos: async ({ _id }, _, context, { cacheControl }) => {
      if (!context.userId) { return null }
      const getPromos = await dbCache.get('promos_post_' + _id)
      if (getPromos) {
        return getPromos
      } else {
        const promos = Promotions.find({ objectId: _id, objectType: 'post' }).count()
        if (promos) {
          dbCache.set('promos_post_' + _id, promos)
          return promos
        }
      }
      return null
    },
    activePromos: async ({ _id }, _, context, { cacheControl }) => {
      if (!context.userId) { return null }
      const getPromos = await dbCache.get('activePromos_post_' + _id)
      if (getPromos) {
        return getPromos
      } else {
        const promos = Promotions.find({ objectId: _id, objectType: 'post', status: 2 }).count()
        if (promos) {
          dbCache.set('activePromos_post_' + _id, promos)
          return promos
        }
      }
      return null
    }
  }
}
