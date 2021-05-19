const stringifyObject = (obj) => {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
  if (obj) {
    return JSON.stringify(obj).replace(/[{}"]/g, '').replace(/[:,\s]/g, '_')
  }
  return ''
}

export default stringifyObject
