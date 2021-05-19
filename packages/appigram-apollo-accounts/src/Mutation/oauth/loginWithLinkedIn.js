import resolver from './resolver'
import {fetch} from 'meteor/fetch'
import {ServiceConfiguration} from 'meteor/appigram:service-configuration'

const handleAuthFromAccessToken = async function ({code, redirectUri}) {
  // works with anything also...
  const accessToken = await getAccessToken(code, redirectUri)
  const identity = await getIdentity(accessToken)

  const serviceData = {
    ...identity,
    accessToken
  }

  return {
    serviceName: 'linkedin',
    serviceData,
    options: {profile: {name: `${identity.firstName} ${identity.lastName}`}}
  }
}

const getTokens = function () {
  const result = ServiceConfiguration.configurations.findOne({service: 'linkedin'})
  return {
    client_id: result.clientId,
    client_secret: result.secret
  }
}

const getAccessToken = async function (code, redirectUri) {
  const url = new URL("https://www.linkedin.com/oauth/v2/accessToken")
  const params = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    ...getTokens()
  }
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  const response = await fetch(url, { method: 'POST' })
  const data = await response.json()
  /* const response = HTTP.post('https://www.linkedin.com/oauth/v2/accessToken', {
    params: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      ...getTokens()
    }
  }).data */

  return data.access_token
}

const getIdentity = async function (accessToken) {
  try {
    const url = new URL("https://www.linkedin.com/v1/people/~:(id,email-address,first-name,last-name,headline)")
    const params = {
      oauth2_access_token: accessToken,
      format: 'json'
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const response = await fetch(url)
    const data = await response.json()
    /* return HTTP.get('https://www.linkedin.com/v1/people/~:(id,email-address,first-name,last-name,headline)', {
      params: {
        oauth2_access_token: accessToken,
        format: 'json'
      }
    }).data */
    return data
  } catch (err) {
    throw new Error('Failed to fetch identity from LinkedIn. ' + err.message)
  }
}

export default resolver(handleAuthFromAccessToken)
