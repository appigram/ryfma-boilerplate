// import { bugsnagClient } from '/imports/shared/bugsnagClient'

export default {
  _cbs: [],
  notify (eventName, err) {
    // if (err) bugsnagClient.notify({ eventName, err })
    this._cbs.map(cb => {
      if (cb.eventName === eventName && typeof cb.callback === 'function') {
        cb.callback()
      }
    })
  },
  on (eventName, cb) {
    this._cbs.push({
      eventName: eventName,
      callback: cb
    })
  }
}
