// Cache
import LRU from 'lru-cache'

const ssrCache = LRU({
  max: 1000,
  maxAge: 1000 * 60 * 5 // 5 minutes
})

export default ssrCache
