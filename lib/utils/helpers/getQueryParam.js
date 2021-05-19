const getQueryParam = (searchStr, param) => {
  const match = RegExp('[?&]' + param + '=([^&]*)').exec(searchStr)
  if (match) {
    const uri = match[1].replace(/\+/g, ' ')
    if (uri) {
      let url = ''
      try {
        url = decodeURIComponent(uri)
      } catch (err) {
        console.log('searchStr error: ', searchStr)
        console.log('param error: ', param)
        console.log('URI error: ', uri)
        console.log(err)
      }
      return url
    }
  }
  return ''
}

export default getQueryParam
