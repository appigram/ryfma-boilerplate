import Rhymes from '/server/api/collections/Rhymes'

const getRhymes = (config) => {
  console.log('Rhymes generation started!')
  const links = {}
  let changefreq = 'monthly'
  const url = config.HOST + '/rhyme/'
  const ampUrl = config.HOST + '/amp/rhyme/'
  const options = {}
  options.fields = {
    _id: 1,
    word: 1,
    countUsed: 1
  }
  options.sort = {
    countUsed: -1
  }
  const rhymes = Rhymes.find({ countUsed: { $gt: 1 } }, options)
  rhymes.forEach(item => {
    try {
      const itemYear = '2021'// item.createdAt.getFullYear()
      if (!links[itemYear]) links[itemYear] = []
      let priority = 0.3
      if (item.countUsed > 10 && item.countUsed < 100) {
        priority = 0.5
        changefreq = 'weekly'
      } else if (item.countUsed > 100 && item.countUsed < 1000) {
        priority = 0.7
        changefreq = 'daily'
      } else if (item.countUsed > 1000) {
        priority = 0.9
        changefreq = 'daily'
      }
      const encWord = encodeURIComponent(item.word)
      links[itemYear].push({
        url: url + encWord,
        lastmod: new Date(),
        changefreq: changefreq,
        priority: priority,
        // ampLink: ampUrl + encWord
      })
    } catch (err) {
      console.log(err)
    }
  })
  console.log('Rhymes generation finished!')
  return links
}

export default getRhymes
