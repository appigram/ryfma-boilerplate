import Festivals from '/server/api/collections/Festivals'
// import {MAX_ALT_STRING} from './constants'

const getContests = (config) => {
  console.log('Contests generation started!')
  const links = {}
  let changefreq = 'weekly'
  const url = config.HOST + '/f/'
  const ampUrl = config.HOST + '/amp/f/'
  const options = {}
  options.sort = { createdAt: 1 }
  options.fields = {
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    // coverImg: 1,
    // brief: 1,
    // title: 1,
    slug: 1,
    status: 1
  }
  const fests = Festivals.find({ isDuel: false }, options)
  fests.forEach(item => {
    try {
      const itemYear = item.createdAt.getFullYear()
      if (!links[itemYear]) links[itemYear] = []
      let priority = 0.1
      if (item.status === 2) {
        priority = 0.9
        changefreq = 'daily'
      }
      /* if (!item.title || !item.brief) {
        console.log('Fest: ', item)
        return
      } */

      // console.log('Fest: ', item._id)
      // const caption = item.brief.length > MAX_ALT_STRING ? item.brief.substring(0, MAX_ALT_STRING) : item.brief
      // const title = item.title.length > MAX_ALT_STRING ? item.title.substring(0, MAX_ALT_STRING) : item.title
      links[itemYear].push({
        url: url + item.slug,
        lastmod: item.updatedAt,
        changefreq: changefreq,
        /*img: [{
          url: `${item.coverImg}`,
          caption: caption,
          title: title
          }
        ]*/
        priority: priority,
        // ampLink: ampUrl + item.slug
      })
    } catch (err) {
      console.log(err)
    }
  })
  console.log('Contests generation finished!')
  return links
}

export default getContests
