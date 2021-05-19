import extractHostname from './extractHostname'

const extractRootDomain = (url) => {
  let domain = extractHostname(url)
  const splitArr = domain.split('.')
  const arrLen = splitArr.length

  // extracting the root domain here
  // if there is a subdomain
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1]
    // check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. '.me.uk')
    if (splitArr[arrLen - 1].length === 2 && splitArr[arrLen - 1].length === 2) {
      // this is using a ccTLD
      domain = splitArr[arrLen - 3] + '.' + domain
    }
  }
  return domain
}

export default extractRootDomain
