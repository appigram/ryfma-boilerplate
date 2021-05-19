import resolver from './resolver'
import { fetch } from 'meteor/fetch'
import { ServiceConfiguration } from 'meteor/appigram:service-configuration'

const handleAuthFromAccessToken = async function ({ code, redirectUri, access_token, userData = '', email = '', invitedByUserId = '' }) {
  // works with anything also...
  /* console.log('code: ', code)
  console.log('redirectUri: ', redirectUri)
  console.log('access_token: ', access_token)
  console.log('userData: ', userData)
  console.log('email: ', email) */
  let response = null
  let accessToken = access_token
  let expiresAt = (+new Date())
  let userEmail = email
  let identityData = userData ? JSON.parse(userData) : {}

  if (code && redirectUri) {
    response = await getAccessToken(code, redirectUri)
    accessToken = response.access_token
    expiresAt = expiresAt + (1000 * response.expires_in)
    userEmail = response.email
    const identity = await getIdentity(accessToken)
    identityData = identity.response[0]
  } else {
    if (access_token && email) {
      const currDate = new Date()
      const nextDate = new Date(currDate.setMonth(currDate.getMonth()+3))
      expiresAt = expiresAt + (1000 * nextDate.getTime())
      if (!userData) {
        const identity = await getIdentity(accessToken)
        if (identity.response) {
          identityData = identity.response[0]
        }
      }
    }
  }

  const serviceData = {
    ...identityData,
    expiresAt,
    email: userEmail,
    accessToken
  }
  // serviceData.id = serviceData.uid
  // delete serviceData.uid

  return {
    serviceName: 'vk',
    serviceData,
    options: {
      profile: {
        name: identityData.nickname ? identityData.nickname : identityData.first_name + ' ' + identityData.last_name,
        invitedByUserId
      }
    }
  }
}

const getTokens = function () {
  const result = ServiceConfiguration.configurations.findOne({service: 'vk'})
  // console.log('getTokens: ', result)
  return {
    client_id: result.appId,
    client_secret: result.secret
  }
}

const getAccessToken = async function (code, redirectUri) {
  const url = new URL("https://api.vk.com/oauth/access_token")
  const params = {
    code,
    redirect_uri: redirectUri,
    ...getTokens()
  }
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  const response = await fetch(url, { method: 'POST' })
  const data = await response.json()
  /* const response = HTTP.post('https://api.vk.com/oauth/access_token', {
    params: {
      code,
      redirect_uri: redirectUri,
      ...getTokens()
    }
  }).content */
  return data
}

const getIdentity = async function (accessToken) {
  try {
    const url = new URL("https://api.vk.com/method/users.get")
    const params = {
      access_token: accessToken,
      v: 5.21,
      fields: 'uid, nickname, first_name, last_name, sex, bdate, timezone, photo, photo_big, city, country, has_mobile, contacts'
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const response = await fetch(url)
    const data = await response.json()
    /* return HTTP.get('https://api.vk.com/method/users.get', {
      params: {
        access_token: accessToken,
        v: 5.21,
        fields: 'uid, nickname, first_name, last_name, sex, bdate, timezone, photo, photo_big, city, country, has_mobile, contacts'
      } }) */
    return data
  } catch (err) {
    throw new Error('Failed to fetch identity from VK. ' + err.message)
  }
}

export default resolver(handleAuthFromAccessToken)
