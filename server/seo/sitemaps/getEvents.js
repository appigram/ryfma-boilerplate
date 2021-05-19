import Events from '/server/api/collections/Events'
// import {MAX_ALT_STRING} from './constants'

const getEvents = (config) => {
  console.log('Events generation started!')
  const links = {}
  let changefreq = 'weekly'
  const url = config.HOST + '/e/'
  const options = {}
  options.fields = {
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    // coverImg: 1,
    // brief: 1,
    status: 1,
    title: 1,
    slug: 1
  }
  const events = Events.find({}, options)
  events.forEach(item => {
    try {
      const itemYear = item.createdAt.getFullYear()
      if (!links[itemYear]) links[itemYear] = []
      let priority = 0.1
      if (item.status === 2) {
        priority = 0.9
        changefreq = 'daily'
      }
      /* if (!item.title || !item.brief) {
        console.log('Event: ', item)
        return
      }
      // console.log('Fest: ', item._id)
      if (item.coverImg) {
        const caption = item.brief.length > MAX_ALT_STRING ? item.brief.substring(0, MAX_ALT_STRING) : item.brief
        const title = item.title.length > MAX_ALT_STRING ? item.title.substring(0, MAX_ALT_STRING) : item.title
        result.push({
          url: url + item.slug,
          changefreq: changefreq,
          img: [{
            url: `${item.coverImg}`,
            caption: caption,
            title: title
          }
          ]
          // ampLink: url + item.slug
        })
      } else {*/
        links[itemYear].push({
          url: url + item.slug,
          lastmod: item.updatedAt,
          changefreq: changefreq,
          priority: priority,
          // ampLink: url + item.slug
        })
      //}
    } catch (err) {
      console.log(err)
    }
  })
  console.log('Events generation finished!')
  return links
}

export default getEvents
