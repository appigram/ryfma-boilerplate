const stripAndFormat = (str, isFromBlog) => {
  let resStr = str.replace(/^(<br\s*\/?>)*|(<br\s*\/?>)*$/i, '')
    .replace(/&nbsp;/gi, '')
    // remove dates
    .replace(/(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}/g, '')
    // remove empty tags
    .replace(/<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/g, '')
    // 1. compress all non-newline whitespaces to single space
    .replace(/ +/g, ' ')
    // 2. remove spaces from begining or end of lines
    .replace(/^ +/gm, '')
    // 3. compress multiple newlines to single newlines (or two)
    .replace(/(\n\s*?\n)\s*\n/g, '$1')
    // 4. remove newlines from begining or end of string
    .replace(/^\s+|\s+$/g, '')
    // 5. remove hashtags from string
    .replace(/#([^\\s]*)/g, '')
    // 6. remove username from string
    .replace(/@([^\\s]*)/g, '')
    .replace('©', '')
    .replace(/Copyright[:]?/gi, '')
    .replace(/Свидетельство о публикации\s?№[\d]*/gi, '')
    .trim()
  if (isFromBlog) {
    return resStr
  } else {
    return resStr
      // Remove links
      .replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, '')
  }
}

export default stripAndFormat
