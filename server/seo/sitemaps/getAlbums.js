import Albums from '/server/api/collections/Albums'
// import {MAX_ALT_STRING} from './constants'

const getAlbums = (config) => {
  console.log('Albums generation started!')
  const currDate = new Date()
  const links = {}
  let changefreq = 'weekly'
  const url = config.HOST + '/album/'
  const ampUrl = config.HOST + '/amp/album/'
  const fields = {}
  const options = {}
  options.sort = { createdAt: 1 }
  // options.limit = 20
  options.fields = {
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    // coverImg: 1,
    // description: 1,
    // title: 1,
    slug: 1
  }
  fields.postCount = { $gt: 0 }
  const albums = Albums.find(fields, options)
  let limitCounter = 0
  albums.forEach(item => {
    let priority = 0.1
    try {
      const itemYear = item.createdAt.getFullYear()
      if (!links[itemYear]) links[itemYear] = []
      const albumUpdatedAt = item.updatedAt
      const hours = Math.floor(Math.abs(albumUpdatedAt - currDate) / 36e5)
      if (hours < 720) {
        priority = 0.5
        changefreq = 'daily'
      }
      if (item.coverImg) {
        /* const description = item.description || item.title
        if (!item.title || !description) {
          console.log('Album: ', item)
          return
        }
        // const caption = description.length > MAX_ALT_STRING ? item.description.substring(0, MAX_ALT_STRING) : item.description
        // const title = item.title.length > MAX_ALT_STRING ? item.title.substring(0, MAX_ALT_STRING) : item.title */
        links[itemYear].push({
          url: url + item._id + '/' + encodeURIComponent(item.slug),
          lastmod: item.updatedAt,
          changefreq: changefreq,
          priority: priority,
          /* img: [{
            url: `${item.coverImg}`,
            caption: caption,
            title: title
          }
        ] */
          // ampLink: url + item._id + '/' + item.slug
        })
      } else {
        const encSlug = encodeURIComponent(item.slug)
        links[itemYear].push({
          url: url + item._id + '/' + encSlug,
          lastmod: item.updatedAt,
          changefreq: changefreq,
          priority: priority,
          // ampLink: ampUrl + item._id + '/' + encSlug
        })
      }
    } catch (err) {
      console.log(err)
    }
  })
  console.log('Albums generation finished!')
  return links
}

export default getAlbums
