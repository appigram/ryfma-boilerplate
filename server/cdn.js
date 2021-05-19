
import { Meteor } from 'meteor/meteor'
import { WebApp, WebAppInternals } from 'meteor/webapp'
import { BrowserPolicy } from 'meteor/browser-policy-common'
import { URL } from 'url'
const CDN_PREFIX = Meteor.settings.CDN_PREFIX || ''

const fontRegExp = /\.(eot|ttf|otf|woff|woff2)$/
const jsCssRegExp = /\.(js|css)$/

Meteor.startup(function () {
  if (!Meteor.isProduction) {
    // Return early if URL isn't HTTPS (or if it isn't set).
    const url = new URL(CDN_PREFIX)
    const isHttps = url.protocol === 'https:'
    if (!isHttps) {
      // return
    }

    // Add CDN awesomeness - this is the critical line.
    // WebAppInternals.setBundledJsCssPrefix(CDN_PREFIX)

    // Trust the URL in our browser policy (if it's available).
    /* try {
      return BrowserPolicy.content.allowOriginForAll(CDN_PREFIX)
    } catch (err) {
      console.log(err)
    } */

    WebApp.rawConnectHandlers.use('/public', (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      return next()
    })

    WebApp.rawConnectHandlers.use('/', (req, res, next) => {
      if (jsCssRegExp.test(req._parsedUrl.pathname)) {
        // console.log('set x-no-compression header')
        res.setHeader('x-no-compression', 'x-no-compression')
      }
      if (fontRegExp.test(req._parsedUrl.pathname)) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Vary', 'Origin')
        res.setHeader('Pragma', 'public')
        res.setHeader('Cache-Control', 'public')
      }
      return next()
    })
  }
})
