import { Meteor } from 'meteor/meteor'
import sanitizeHtml from 'sanitize-html'

export const Utils = {}

Utils.sanitize = function (s) {
  // console.log('// before sanitization:')
  // console.log(s)
  if (Meteor.isServer) {
    s = sanitizeHtml(s, {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul',
        'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike',
        'code', 'hr', 'br', 'div', 'table', 'thead', 'caption',
        'tbody', 'tr', 'th', 'td', 'pre', 'img'
      ]
    })
    // console.log('// after sanitization:')
    // console.log(s)
  }
  return s
}
