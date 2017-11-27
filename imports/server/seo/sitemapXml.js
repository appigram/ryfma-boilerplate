import sm from 'sitemap'
import path from 'path'
import Posts from '../../api/collections/Posts'
import Users from '../../api/collections/Users'

const config = {
  HOST: process.env.HOST || 'http://sf1.welyx.com',
  NAME: process.env.NAME || 'sitemap',
  GZIP: true, // process.env.GZIP === 'true',
  SIZE: +process.env.SIZE || 25000,
  DST: process.env.DST || path.resolve('/tmp')
}

const getPages = (data) => {
  const result = data || [];
  [].push.apply(result, [
    { url: config.HOST + '/', changefreq: 'always' },
    { url: config.HOST + '/new', changefreq: 'daily' },
    { url: config.HOST + '/search/posts', changefreq: 'monthly' },
    { url: config.HOST + '/search/users', changefreq: 'monthly' }
  ])

  return new Promise(resolve => resolve(result))
}

const getUsers = (data) => {
  const result = data || []
  return new Promise((resolve, reject) => {
    const changefreq = 'weekly'
    const url = config.HOST + '/u/'

    const users = Users.find()
    users.forEach(item => {
      result.push({
        url: url + encodeURIComponent(item.username),
        changefreq: changefreq,
        img: [{
          url: `${item.profile.image}`,
          caption: item.profile.name,
          title: item.profile.name
        }
        ],
        ampLink: url + encodeURIComponent(item.username)
      })
    })
    resolve(result)
  })
}

const getPosts = (data) => {
  const result = data || []
  return new Promise((resolve, reject) => {
    const changefreq = 'weekly'
    const url = config.HOST + '/p/'

    const posts = Posts.find()
    posts.forEach(item => {
      result.push({
        url: url + encodeURIComponent(`${item._id}/${item.slug}`),
        changefreq: changefreq,
        img: [{
          url: `${item.coverImg}`,
          caption: item.description,
          title: item.title
        }
        ],
        ampLink: url + encodeURIComponent(`${item._id}/${item.slug}`)
      })
    })
    resolve(result)
  })
}

const result = []

const generateSitemap = () => {
  Promise.all([
    getPages(result),
    getUsers(result),
    getPosts(result),
  ])
  // .then(() => result = addAlternates(result)) // Yandex robot errors
    .then(() => {
      return new Promise((resolve, reject) => {
        sm.createSitemapIndex({
          cacheTime: 1000 * 60 * 60 * 24 * 1, // 1 day
          hostname: config.HOST,
          sitemapName: config.NAME,
          gzip: config.GZIP,
          sitemapSize: config.SIZE,
          targetFolder: config.DST,
          urls: result,
          callback: (err, result) => {
            if (err) {
              return reject(err)
            }
            resolve(result)
          }
        })
      })
    })
    .then(() => {
      console.log('Sitemap generated to - ' + config.DST)
    })
}

if (process.env.NODE_ENV === 'production') {
  generateSitemap()
}
