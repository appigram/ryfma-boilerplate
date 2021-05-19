import Posts from '/server/api/collections/Posts'
import getSlug from 'speakingurl'
// import {MAX_ALT_STRING} from './constants'

const getPosts = (config) => {
  console.log('Posts generation started!')
  const links = {}
  let changefreq = 'weekly'
  const url = config.HOST + '/p/'
  const ampUrl = config.HOST + '/amp/p/'
  const options = {}
  options.sort = { createdAt: 1 }
  options.fields = {
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    coverImg: 1,
    // excerpt: 1,
    title: 1,
    seoTitle: 1,
    slug: 1,
    likeCount: 1,
    commentsCount: 1
  }
  const posts = Posts.find({ paymentType: { $nin: [ 1, 2, 3 ] }, status: 2 }, options)
  posts.forEach(item => {
    let priority = 0.3
    try {
      const itemYear = item.createdAt.getFullYear()
      if (!links[itemYear]) links[itemYear] = []
      // console.log('Post: ', item._id)
      if (item.coverImg) {
        priority += 0.2
      }
      if (item.likeCount > 50) {
        priority += 0.2
      }
      if (item.commentsCount > 2 || item.likeCount > 500) {
        priority += 0.2
      }
      if (item.title.includes('краткое содержание')) {
        priority = 0.9
        changefreq = 'daily'
      }

      if (priority > 0.6) {
        changefreq = 'daily'
      }

      const slug = item.slug || getSlug(item.seoTitle, { lang: 'ru' })
      /* if (item.coverImg) {
        if (!item.title || !item.excerpt) {
          console.log('Post: ', item)
          return
        }
        const caption = item.excerpt.length > MAX_ALT_STRING ? item.excerpt.substring(0, MAX_ALT_STRING) : item.excerpt
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
          // ampLink: ampUrl + `${item._id}/${slug.replace('"', '')}`,
          // androidLink: 'android-app://com.company.test/page-1/',
        })
      //}
    } catch (err) {
      console.log(err)
    }
  })
  console.log('Posts generation finished!')
  return links
}

export default getPosts
