const stripAndFormatMsg = (str) => {
  return str.replace(/^(<br\s*\/?>)*|(<br\s*\/?>)*$/i, '')
    .replace(/&nbsp/gi, '')
    // remove empty tags
    .replace(/<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/g, '')
    // 1. compress all non-newline whitespaces to single space
    .replace(/ +/g, ' ')
    // 2. remove spaces from begining or end of lines
    .replace(/^ +/gm, '')
    // 3. compress multiple newlines to single newlines (or two)
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // 4. remove newlines from begining or end of string
    .replace(/^\s+|\s+$/g, '')
    .trim()
}

export default stripAndFormatMsg
