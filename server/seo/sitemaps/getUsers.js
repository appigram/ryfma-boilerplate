import Users from '/server/api/collections/Users'
// import {MAX_ALT_STRING} from './constants'

const getUsers = (config) => {
  console.log('Users generation started!')
  const currDate = new Date()
  const links = {}
  let changefreq = 'weekly'
  const url = config.HOST + '/u/'
  const ampUrl = config.HOST + '/amp/u/'
  const options = {}
  options.sort = { createdAt: 1 }
  const fields = {
    'stats.postsCount': { $gt: 0 },
    'isDeleted': { $exists: false }
  }
  options.fields = {
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    username: 1,
    isClassic: 1,
    'profile.lastLogin': 1,
    'stats.postsCount': 1
    // 'profile.name': 1,
    // 'profile.image': 1
  }
  const users = Users.find(fields, options)
  users.forEach(item => {
    let priority = 0.3
    try {
      const itemYear = item.createdAt.getFullYear()
      if (!links[itemYear]) links[itemYear] = []
      const userLastLogin = item.profile.lastLogin
      const postsCount = item.stats.postsCount
      if (userLastLogin) {
        const hours = Math.floor(Math.abs(userLastLogin - currDate) / 36e5)
        if (hours < 720) {
          priority += 0.2
          changefreq = 'daily'
        }
      }
      if (postsCount > 10) {
        priority += 0.2
      } else if (postsCount > 100) {
        priority += 0.2
      }

      if (item.isClassic) {
        priority = 0.9
        changefreq = 'daily'
      }
      /*
        const name = item.profile.name || item.username
        if (!name) {
          console.log('User: ', item)
          Users.update(
            { _id: item._id },
            { $set: { 'profile.name': item.username } }
          )
        }
      // console.log('User: ', item._id
      const caption = name.length > MAX_ALT_STRING ? item.profile.name.substring(0, MAX_ALT_STRING) : item.profile.name
      result.push({
        url: url + encodeURIComponent(item.username),
        changefreq: changefreq,
        img: [{
          url: `${item.profile.image}`,
          caption: caption,
          title: caption
        }
        ]
        // ampLink: url + encodeURIComponent(item.username)
      }) */
      const encUsername = encodeURIComponent(item.username)
      links[itemYear].push({
        url: url + encUsername,
        lastmod: item.updatedAt,
        changefreq: changefreq,
        priority: priority,
        // ampLink: ampUrl + encUsername
      })
    } catch (err) {
      console.log(err)
    }
  })
  console.log('Users generation finished!')
  return links
}

export default getUsers
