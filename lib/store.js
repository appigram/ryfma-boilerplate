let store = {}
const ssrStore = {
  store: {},
  setItem: function (k, v) {
    this.store[k] = v
  },
  getItem: function (k) {
    if (k in this.store) {
      return this.store[k]
    }
    return undefined
  },
  removeItem: function (k) {
    if (k in this.store) {
      delete this.store[k]
    }
  },
  clear: function () {
    this.store = {}
  }
}

// Check localStorage availability (iOS private mode doesn't support it so needs to checked)
if (typeof window !== 'undefined') {
  try {
    const testKey = '___test'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    store = window.localStorage
  } catch (e) {
    store = ssrStore
  }
} else {
  store = ssrStore
}

export default store
