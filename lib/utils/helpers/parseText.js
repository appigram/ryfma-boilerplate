const parseText = (text, isComment) => {
  if (text) {
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

    // parse mentions
    const mentionRegEx = /\B[@＠][a-z0-9_-]+/gi
    const mentions = commText.match(mentionRegEx)
    if (mentions) {
      commText = mentions.map(mention => commText.replace(mention, `<a href='/u/${mention.replace('@', '').replace('＠', '')}' class='mention-link' target='_blank' rel='ugc'>${mention}</a>`))
    }

    return commText
  } else {
    return text
  }
}

export default parseText
