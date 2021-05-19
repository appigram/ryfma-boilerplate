import Redis from 'ioredis'
import lru from 'redis-lru'

const isDev = process.env.NODE_ENV === 'development'

const defaultMaxAge = 1000 * 60 * 30 * 1 // 0.5 hours (1 * 30 minutes)
const options = {
  max: 100000, // max 100000 items
  maxAge: defaultMaxAge
}

// TODO: Check Redis connection
// if (!client.isConnected()) await client.connect();

const redisClient = isDev ?
  new Redis({
    // Options
    enableAutoPipelining: true,
    maxRetriesPerRequest: 3,
    connectTimeout: 10000
  }) :
  new Redis({
    sentinels: [{
      host: '',
      port: 
    }],
    name: '',
    password: '',
    role: 'master',
    // Options
    enableAutoPipelining: true,
    maxRetriesPerRequest: 3,
    connectTimeout: 10000
  })


const redisLRU = lru(redisClient, options)

const LRUCache = {
  get: async (key, skipParse = false) => {
    try {
      return await redisLRU.get(key)
    } catch (err) {
      console.log('LRUCache get error: ', err)
    }
  },
  set: async (key, doc, maxAge = options.maxAge) => {
    try {
      redisLRU.set(key, doc, maxAge)
    } catch (err) {
      console.log('LRUCache set error: ', err)
    }
  },
  has: async (key) => {
    try {
      return await redisLRU.has(key)
    } catch (err) {
      console.log('LRUCache has error: ', err)
    }
  },
  del: async (key) => {
    try {
      await redisLRU.del(key)
    } catch (err) {
      console.log('LRUCache del error: ', err)
    }
  },
  delPattern: async (pattern) => {
    // Create a readable stream (object mode)
    /* const lruPrefix = 'LRU-CACHE!-k-'
    const stream = redisClient.scanStream({
      match: `${lruPrefix}${pattern}*`,
      count: 100
    })
    stream.on('data', function (keys) {
      // keys` is an array of strings representing key names
      // console.log('keys by pattern: ', keys)
      if (keys.length) {
        // redis.unlink(keys)
        const pipeline = redisClient.pipeline();
        for (let i = 0; i < keys.length; i++) {
          if (!(keys[i].indexOf('css_cache') > -1)) {
            // redisLRU.del(keys[i].replace(lruPrefix, ''))
            pipeline.del(keys[i])
          }
        }
        pipeline.exec()
      }
    })
    stream.on('end', function () {
      // console.log('Remove keys by pattern done')
    }) */

    const keys = await redisLRU.keys(pattern)
    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        if (!(keys[i].indexOf('css_cache') > -1)) {
          redisLRU.del(keys[i])
        }
      }
    }
  },
  keys: async (pattern) => {
    try {
      return await redisLRU.keys(pattern)
    } catch (err) {
      console.log('LRUCache keys error: ', err)
    }
  },
  reset: async () => {
    try {
      await redisLRU.reset()
    } catch (err) {
      console.log('LRUCache reset error: ', err)
    }
  },
  length: async () => await redisLRU.count(),
  itemCount: async () => await redisLRU.count()
}

export default LRUCache
