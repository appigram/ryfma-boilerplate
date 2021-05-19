import Tags from '/server/api/collections/Tags'
// import getSlug from 'speakingurl'

const getTags = (config) => {
  console.log('Tags generation started!')
  const currDate = new Date()
  const links = {}
  let changefreq = 'weekly'
  const url = config.HOST + '/tags/'
  const ampUrl = config.HOST + '/amp/tags/'
  const options = {}
  options.fields = {
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    name: 1,
    slug: 1
  }
  const tags = Tags.find({ count: { $gt: 7 }}, options)
  tags.forEach(item => {
    let priority = 0.3
    try {
      const itemYear = item.createdAt ? item.createdAt.getFullYear() : currDate.getFullYear()
      if (!links[itemYear]) links[itemYear] = []
      const slug = item.slug ? item.slug : item.name
      const encSlug = encodeURIComponent(slug)
      if (item.count > 100) {
        priority = 0.5
      } else if (item.count > 1000) {
        priority = 0.7
      } else if (item.count > 10000) {
        priority = 0.9
        changefreq = 'daily'
      }
      links[itemYear].push({
        url: url + item._id + '/' + encSlug,
        lastmod: item.updatedAt || new Date(),
        changefreq: changefreq,
        priority: priority,
        // ampLink: ampUrl + item._id + '/' + encSlug,
      })
    } catch (err) {
      console.log(err)
    }
  })
  console.log('Tags generation finished!')
  return links
}

export default getTags
