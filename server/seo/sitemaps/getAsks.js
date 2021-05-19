import Asks from '/server/api/collections/Asks'

const getAsks = (config) => {
  console.log('Asks generation started!')
  const currDate = new Date()
  const links = {}
  let changefreq = 'weekly'
  const url = config.HOST + '/ask/'
  const options = {}
  options.sort = { createdAt: 1 }
  options.fields = {
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    slug: 1
  }
  const asks = Asks.find({}, options)
  asks.forEach(item => {
    let priority = 0.1
    try {
      const itemYear = item.createdAt.getFullYear()
      if (!links[itemYear]) links[itemYear] = []
      const albumUpdatedAt = item.updatedAt
      const albumCreatedAt = item.createdAt
      const hoursUpdates = Math.floor(Math.abs(albumUpdatedAt - currDate) / 36e5)
      const hoursCreates = Math.floor(Math.abs(albumCreatedAt - currDate) / 36e5)
      if (hoursUpdates < 720 || hoursCreates < 720) {
        priority = 0.7
        changefreq = 'daily'
      }
      links[itemYear].push({
        url: url + item._id + '/' + encodeURIComponent(item.slug),
        lastmod: item.updatedAt,
        changefreq: changefreq,
        priority: priority
        // ampLink: url + item._id + '/' + item.name
      })
    } catch (err) {
      console.log(err)
    }
  })
  console.log('Asks generation finished!')
  return links
}

export default getAsks
