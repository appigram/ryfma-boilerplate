import BookChapters from '/server/api/collections/BookChapters'
import getSlug from 'speakingurl'
// import {MAX_ALT_STRING} from './constants'

const getBookChapters = (config) => {
  console.log('BookChapters generation started!')
  const links = {}
  let changefreq = 'weekly'
  const url = config.HOST + '/ch/'
  const options = {}
  options.sort = { createdAt: 1 }
  options.fields = {
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    // htmlBody: 1,
    // title: 1,
    slug: 1
  }
  const bookChapters = BookChapters.find({}, options)
  bookChapters.forEach(item => {
    let priority = 0.3
    try {
      const itemYear = item.createdAt.getFullYear()
      if (!links[itemYear]) links[itemYear] = []
      // console.log('Book: ', item._id)
      const slug = item.slug ? item.slug : getSlug(item.title, { lang: 'ru' })
      /* if (item.coverImg) {
        if (!item.title || !item.htmlBody) {
          console.log('BookChapter: ', item)
          return
        }
        const caption = item.htmlBody.length > MAX_ALT_STRING ? item.htmlBody.substring(0, MAX_ALT_STRING) : item.htmlBody
        const title = item.title.length > MAX_ALT_STRING ? item.title.substring(0, MAX_ALT_STRING) : item.title

        links[itemYear].push({
          url: url + `${item._id}/${slug.replace('"', '')}`,
          changefreq: changefreq,
          img: [{
            url: `${item.coverImg}`,
            caption: caption,
            title: title
          }
          ]
          // ampLink: url + `${item._id}/${slug}`
        })
      } else { */
        links[itemYear].push({
          url: url + `${item._id}/${slug.replace('"', '')}`,
          lastmod: item.updatedAt,
          changefreq: changefreq,
          priority: priority,
          // ampLink: url + `${item._id}/${slug}`
        })
      // }
    } catch (err) {
      console.log(err)
    }
  })
  console.log('BookChapters generation finished!')
  return links
}

export default getBookChapters
