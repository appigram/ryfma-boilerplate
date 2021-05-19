import linkifyIt from 'linkify-it'
// import tlds from 'tlds'

const linkify = linkifyIt()
// linkify.tlds(tlds)

const removeDuplicates = (array, propertyName) => {
  return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i)
}

const linkifyText = (text) => {
  if (text) {
    let result = text.replace(/<a\b[^>]*>(.*?)<\/a>/ig, "$1")
    const links = linkify.match(result)
    if (links) {
      const urls = links.map(link => { return { text: link.text, schema: link.schema } })
      const uniqueUrls = removeDuplicates(urls, 'text')
      if (uniqueUrls) {
        uniqueUrls.map(href => {
          let cleanUrl = href.text.replace('.</p', '').replace(',</p', '').replace(';</p', '')
          if (!href.schema) {
            cleanUrl = 'https://' + cleanUrl
          }
          if (href.schema === 'mailto:') {
            cleanUrl = 'mailto:' + cleanUrl
          }
          const re = new RegExp(href.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
          if (cleanUrl.includes('ryfma.com')) {
            result = result.replace(re, `<a href='${cleanUrl}' class='away-link' rel='ugc'>${href.text}</a>`)
          } else {
            result = result.replace(re, `<a href='${cleanUrl}' class='away-link' rel='nofollow noopener ugc' target='_blank'>${href.text}</a>`)
          }
        })
      }
    }
    return result
  } else {
    return text
  }
}

export default linkifyText
