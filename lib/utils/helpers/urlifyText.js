const urlifyText = (text, showPreview = false) => {
  if (text) {
    let result = text
    const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    const links = text.match(exp)
    if (links) {
      links.map(href => {
        if (href.includes('ryfma.com')) {
          const re = new RegExp(href, 'ig')
          if (!showPreview) {
            result = result.replace(re, `<a href='${href}' class='away-link' rel='ugc' target='_blank'>${href}</a>`)
          } else {
            result.replace(re, `<a href='${href}' class='away-link' target='_blank'>${href}</a>`)
          }
        }
      })
    }
    return result
  } else {
    return text
  }

  // const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  // return text.replace(exp, "<a href='$1'>$1</a>")
}

export default urlifyText
