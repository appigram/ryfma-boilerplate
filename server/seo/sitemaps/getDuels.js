import Festivals from '/server/api/collections/Festivals'

const getDuels = (config) => {
  console.log('Duels generation started!')
  const links = {}
  let changefreq = 'weekly'
  const url = config.HOST + '/d'
  const options = {}
  options.sort = { createdAt: 1 }
  options.fields = {
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    status: 1,
    slug: 1
  }
  const duels = Festivals.find({ isDuel: true }, options)
  duels.forEach(item => {
    try {
      const itemYear = item.createdAt.getFullYear()
      if (!links[itemYear]) links[itemYear] = []
      let priority = 0.1
      if (item.status === 2) {
        priority = 0.9
        changefreq = 'daily'
      }
      // console.log('Fest: ', item._id)
      links[itemYear].push({
        url: `${url}/${item._id}/${item.slug}`,
        lastmod: item.updatedAt,
        changefreq: changefreq,
        priority: priority,
        // ampLink: url + item.slug
      })
    } catch (err) {
      console.log(err)
    }
  })
  console.log('Duels generation finished!')
  return links
}

export default getDuels
