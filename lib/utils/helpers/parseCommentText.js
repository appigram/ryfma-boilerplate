import linkifyText from './linkifyText'

const parseCommentText = (text, isComment = true) => {
  let commText = text
  // strip html link
  const linkRegEx = /<a\b[^>]*>(.*?)<\/a>/gi
  const hrefLinks = commText.match(linkRegEx)
  if (hrefLinks) {
    hrefLinks.map(href => {
      const linkText = href.match(/<a [^>]+>([^<]+)<\/a>/i)
      if (linkText) {
        commText = commText.replace(href, linkText[1])
      }
    })
  }

  // linkify (ryfma.com links only in comments)
  if (isComment) {
    if (commText.indexOf('ryfma.com') > -1) {
      commText = linkifyText(commText)
    }
  } else {
    commText = linkifyText(commText)
  }

  // parse mentions
  const mentionRegEx = /\B[@＠][a-z0-9_-]+/gi
  const mentions = commText.match(mentionRegEx)
  if (mentions) {
    commText = mentions.map(mention => commText.replace(mention, `<a href='/u/${mention.replace('@', '').replace('＠', '')}' class='mention-link' target='_blank' rel='ugc'>${mention}</a>`))
  }

  return commText
}

export default parseCommentText
