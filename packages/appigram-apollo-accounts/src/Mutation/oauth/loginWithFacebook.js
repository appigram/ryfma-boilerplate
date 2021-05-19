import resolver from './resolver'
import { fetch } from 'meteor/fetch'

const handleAuthFromAccessToken = async function ({ accessToken, invitedByUserId = '' }) {
  const identity = await getIdentity(accessToken)
  const serviceData = {
    ...identity,
    accessToken
  }
  return {
    serviceName: 'facebook',
    serviceData,
    options: {
      profile: {
        name: identity.name,
        invitedByUserId
      }
    }
  }
}

const getIdentity = async function (accessToken) {
  const fields = ['id', 'email', 'name', 'first_name', 'last_name', 'link', 'gender', 'locale', 'age_range']
  try {
    const url = new URL("https://graph.facebook.com/v9.0/me")
    const params = {
      access_token: accessToken,
      fields: fields.join(',')
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // HTTP.get('https://graph.facebook.com/v3.2/me', {params: {access_token: accessToken, fields: fields.join(',')}}).data
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (err) {
    throw new Error('Failed to fetch identity from Google. ' + err.message)
  }
}

export default resolver(handleAuthFromAccessToken)
