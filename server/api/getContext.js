import { Meteor } from 'meteor/meteor'
import getUserForContext from '/server/utils/getUserForContext'

//Meteor.bindEnvironment(
const getContext = async (token, headers) => {
  if (token) {
    const user = await getUserForContext(token)
    return {
      headers,
      ...user
    }
  } else {
    const cookies = headers.cookie
    if (cookies) {
      if (typeof cookies === 'string') {
        // console.log('=== Process cookies ===')
        // console.log('token: ', token)
        // console.log('cookies: ', cookies)
        const cookiesObj = Object.fromEntries(cookies.split(/; */).map(c => {
          const [ key, ...v ] = c.split('=')
          return [ key, decodeURIComponent(v.join('=')) ]
        }))
        const user = await getUserForContext(cookiesObj.meteor_login_token)
        return {
          headers,
          ...user
        }
      } else {
        const user = await getUserForContext(cookies.meteor_login_token)
        return {
          headers,
          ...user
        }
      }
    } else {
      return {
        headers,
      }
    }
  }
}

export default getContext
