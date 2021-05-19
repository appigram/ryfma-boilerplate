

import TR from 'turbo-rss'
import path from 'path'
import fs from 'fs'
import uploadToS3 from '/server/utils/uploadToS3'
import getSlug from 'speakingurl'

import Posts from '/server/api/collections/Posts'
import Users from '/server/api/collections/Users'
// import Festivals from '/server/api/collections/Festivals'

const config = {
  HOST: 'https://ryfma.com',
  NAME: process.env.NAME || 'turbo-rss',
  GZIP: true, // process.env.GZIP === 'true',
  SIZE: 25000, // +process.env.SIZE || 25000,
  DST: process.env.DST || path.resolve('/tmp') // '../../../public'
}

const options = {
  title: 'Ryfma (Рифма.ру) - стихи, рассказы, фанфики, книги.',
  link: 'https://ryfma.com',
  description: 'Публикуй стихи, рассказы, фанфики, книги и зарабатывай своим творчеством. Читай и поддерживай любимых авторов. Генератор и подбор рифм онлайн.',
  language: 'ru'
}

const getPosts = (data) => {
  console.log('TurboXML Posts generation started!')
  const result = data || []
  return new Promise((resolve, reject) => {
    const options = {}
    const fields = {
       paymentType: { $nin: [ 1, 2, 3 ] } 
    }
    options.sort = {
      createdAt: -1 // Sorted by createdAt descending by default
    }
    options.skip = 0
    options.limit = 10000
    options.fields = {
      _id: 1,
      createdAt: 1,
      userId: 1,
      title: 1,
      slug: 1,
      coverImg: 1,
      htmlBody: 1
    }
    const posts = Posts.find(fields, options)
    posts.forEach((item, index) => {
      console.log(index + ': ' + item._id)
      const slug = item.slug ? item.slug : getSlug(item.title, { lang: 'ru' })
      const author = Users.findOne({ _id: item.userId })
      if (author) {
        const today = new Date(item.createdAt)
        const UTCstring = today.toUTCString()
        const content = item.htmlBody.replace(/<br\s+\/>/gi, '').replace(/\n/gi, '')
        result.push({
          title: item.title,
          image_url: item.coverImg,
          url: `https://ryfma.com/p/${item._id}/${slug.replace('"', '')}`,
          author: author.profile.name,
          date: UTCstring,
          content: content,
          menu: [
            {
              link: 'https://ryfma.com/',
              text: '🏠Главная'
            },
            {
              link: 'https://ryfma.com/latest',
              text: '⏳Последнее'
            },
            {
              link: 'https://ryfma.com/best',
              text: '👏Популярное'
            },
            {
              link: 'https://ryfma.com/classic',
              text: '🔥Классики'
            },
            {
              link: 'https://ryfma.com/e/all',
              text: '🎤Мероприятия'
            },
            {
              link: 'https://ryfma.com/d/all',
              text: '✍🏻Дуэли'
            },
            {
              link: 'https://ryfma.com/f/all',
              text: '🏆Конкурсы'
            },
            {
              link: 'https://ryfma.com/login',
              text: '👉Войти'
            },
            {
              link: 'https://ryfma.com/register',
              text: '✍🏻Регистрация'
            }
          ]
        })
      }
    })
    resolve(result)
  })
}

const urls = []
const generateTurboFeedXML = () => {
  Promise.all([
    getPosts(urls)
  ])
    .then(() => {
      return new Promise((resolve, reject) => {
        const chunk = 1000
        let index = 0
        for (let i = 0, j = urls.length; i < j; i += chunk, index++) {
          if (index > 9) {
            break
          }
          const chunkArr = urls.slice(i, i + chunk)
          const feed = new TR(options, chunkArr)
          const result = feed.xml()
          const filePath = `${config.DST}/turbo-feed-${index}.xml`
          const stream = fs.createWriteStream(filePath)
          stream.once('open', function (fd) {
            stream.write(result)
            stream.end()
            resolve(result)
          })
        }
      })
    })
    .then(() => {
      console.log('Sitemap generated to - ' + config.DST)
      uploadToS3(config.DST, 'turboRSS/')
    })
}

// generateTurboFeedXML()

export { generateTurboFeedXML }
