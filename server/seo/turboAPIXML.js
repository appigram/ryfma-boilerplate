import { Meteor } from 'meteor/meteor'
import TurboAPI from './turboAPI'
import getSlug from 'speakingurl'

import Posts from '/server/api/collections/Posts'
import Users from '/server/api/collections/Users'
import Comments from '/server/api/collections/Comments'
import Rhymes from '/server/api/collections/Rhymes'
// import Festivals from '/server/api/collections/Festivals'

import videoLinkParser from '/lib/utils/helpers/videoLinkParser'
import parseText from '/lib/utils/helpers/parseText'
import formatDate from '/lib/utils/helpers/formatDate'

const IS_DEBUG = process.env.NODE_ENV === 'development'

const config = {
  HOST_ADDRESS: 'https://ryfma.com/',
  OAUTH_TOKEN: Meteor.settings.private.yandex.turboOAuthKey,
  GZIP: true,
  SIZE: 25000
}

const options = {
  title: 'Ryfma (Рифма.ру) - книги, фанфики, стихи, рассказы.',
  link: 'https://ryfma.com',
  description: 'Публикуй книги, фанфики, стихи, рассказы и зарабатывай своим творчеством. Читай и поддерживай любимых авторов',
  language: 'ru'
}

/* const menu = [
  '<a href="https://ryfma.com/">🏠 Главная</a>',
  '<a href="https://ryfma.com/">📚 Книги</a>',
  '<a href="https://ryfma.com/best">👏 Популярное</a>',
  '<a href="https://ryfma.com/classic">🔥 Классики</a>',
  '<a href="https://ryfma.com/f/all">🏆 Конкурсы</a>',
  '<a href="https://ryfma.com/login">👉 Войти</a>'
] */

const formatCommentDate = (date) => {
  const monthNames = [
    'янв', 'фев', 'мар',
    'апр', 'май', 'июн', 'июл',
    'авг', 'сен', 'окт',
    'ноя', 'дек'
  ]

  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()

  return day + ' ' + monthNames[monthIndex] + ' ' + year
}

const excludeTurboPages = [

]

const getPosts = (data) => {
  console.log('TurboXML Posts generation started!')
  const result = data || []
  return new Promise((resolve, reject) => {
    // Exclude some pages
    if (excludeTurboPages.length > 0) {
      for (let i = 0; i < excludeTurboPages.length; i += 1) {
        const today = new Date()
        const UTCstring = today.toUTCString()
        result.push(`<item turbo="false">
          <title>Post not found</title>
          <link>${excludeTurboPages[i]}</link>
          <pubDate>${UTCstring}</pubDate>
          <author>No name</author>
          <turbo:content>
            <![CDATA[
              <header>
                <h1>Post not found</h1>
              </header>
            ]]>
          </turbo:content>
        </item>
        `)
      }
    }

    const options = {}
    const fields = {
      status: 2,
      paymentType: { $nin: [1, 2, 3] }
    }
    // fields.coverImg = { $exists: true }
    // fields.commentsCount = { $gt: 0 }

    options.sort = {
      postedAt: -1 // Sorted by postedAt descending by default
    }

    const forLastDay = true
    if (forLastDay) {
      const dayAgoDate = new Date()
      const beforeDate = new Date()
      beforeDate.setUTCDate(beforeDate.getDate())
      dayAgoDate.setUTCDate(dayAgoDate.getDate() - 2) // for last day
      // beforeDate.setUTCDate(beforeDate.getDate() - 137)
      // dayAgoDate.setUTCDate(dayAgoDate.getDate() - 147) // for last day

      fields.postedAt = {
        $gte: dayAgoDate,
        $lte: beforeDate,
      }
      // console.log('fields: ', fields)
    }

    // options.skip = 171000
    // options.limit = 1000 // TODO: disable

    options.fields = {
      _id: 1,
      createdAt: 1,
      userId: 1,
      title: 1,
      seoTitle: 1,
      slug: 1,
      coverImg: 1,
      // excerpt: 1,
      htmlBody: 1,
      videoLink: 1
    }
    console.log('fields: ', fields)
    // fields.tags = {$in: ['8k8gFkZLoXLM3y4s3']} // short stories
    const posts = Posts.find(fields, options)

    console.log('posts: ', posts.count())
    posts.forEach((item, index) => {
      // console.log('post: ', item)
      try {
        // console.log('post: ', item)
        const slug = item.slug ? item.slug : getSlug(item.title, { lang: 'ru' })
        const optionsU = {}
        optionsU.fields = {
          _id: 1,
          'profile.name': 1
        }
        const author = Users.find({ _id: item.userId }, optionsU).fetch()[0]
        if (author) {
          const today = new Date(item.createdAt)
          const UTCstring = today.toUTCString()
          let title = item.seoTitle || 'No title'
          // const content = item.htmlBody.replace(/<br\s+\/>/gi, '').replace(/\n/gi, '').replace(/�/gi, '').replace(/[{}]/gi, '').replace(/\s\s+/gi, ' ').replace(/<p>\s.*<\/p>/gi, '').replace(/<p>[-_.*]*<\/p>/gi, '')
          let preContent = item.htmlBody || ''
          if (preContent.substring(0, 3) !== '<p>') {
            preContent = '<p>' + preContent
          }
          if (preContent.substring(preContent.length - 4, preContent.length) !== '<\p>') {
            preContent += '</p>'
          }
          let content = preContent.replace(/<br\s+\/>/gi, '</p><p>').replace(/\n/gi, '').replace(/�/gi, '').replace(/[{}]/gi, '').replace(/ѽ/gi, '').replace(/\s\s+/gi, ' ').replace(/<\/p><\/p>/gi, '</p>').replace(/<p><p>/gi, '<p>').replace(/\u0003/gi, '</p>\n<p>').replace(/\u000f/gi, '').replace(/\t/gi, ' ').replace(/[\b\f\v]*/gi, '')
          // .replace(/<p>[\s-_.*]*<\/p>/gi, '')
          const link = `https://ryfma.com/p/${item._id}/${getSlug(slug.replace('"', ''), { lang: 'ru' })}`.replace('&', '&amp;').replace('"', '&quot;').replace('\'', '&apos;').replace('<br', '')
          if (title.indexOf('<') > -1 || title.indexOf('>') > -1) {
            title = content.split(/<\/p>/)[0].trim().replace('<p>', '').replace(/[&\/\\#,+()$~%.'":;*?<>{}]/g, '')
          }

          const optionsC = {}
          optionsC.sort = {
            createdAt: -1 // Sorted by createdAt descending by default
          }
          optionsC.limit = 10
          optionsC.fields = {
            _id: 1,
            createdAt: 1,
            userId: 1,
            slug: 1,
            content: 1
          }
          const comments = Comments.find({ objectId: item._id, objectType: 'post' }, optionsC).fetch()
          let commentsBlock = ''
          if (comments.length > 0) {
            commentsBlock = `<div data-title="Комментарии" data-block="comments" data-url=${link}#comments>`
            const commentsLength = comments.length < 10 ? comments.length : 10
            const commentTime = formatCommentDate(item.createdAt)
            for (let i = 0; i < commentsLength; i++) {
              const comment = comments[i]
              const commText = parseText(comment.content)
              const user = Users.findOne({ _id: comment.userId }, { fields: { _id: 1, 'profile.image': 1, 'profile.name': 1 } })
              commentsBlock += `<div
                data-block="comment"
                data-author="${user.profile.name}"
                data-avatar-url="${user.profile.image}"
                data-subtitle="${commentTime}"
               >
                <div data-block="content">
                  ${commText}
                </div>
              </div>`
            }
            commentsBlock += `
            </div>`
          }

          let turboItem = `<item turbo="true">
            <title>${item.seoTitle}</title>
            <link>${link}</link>
            <pubDate>${UTCstring}</pubDate>
            <author>${author.profile.name ? author.profile.name.replace('&', '&amp;').replace('"', '&quot;').replace('\'', '&apos;') : 'No name'}</author>
            <turbo:content>
              <![CDATA[
                <header>
                  <h1>${title}</h1>
                </header>
          `

          if (item.coverImg) {
            turboItem += `<img src="${item.coverImg}" />`
          }

          if (item.videoLink) {
            let iframeBlock = null
            const videoSrc = videoLinkParser(item.videoLink)
            if (videoSrc.source === 'youtube') {
              iframeBlock = `<iframe
                src='https://www.youtube.com/embed/${videoSrc.id}'
                width="560"
                height="315"
                frameBorder="0"
                allowFullScreen="true"
                allow="autoplay; encrypted-media"
                referrerpolicy="origin"
              ></iframe>`
            } else if (videoSrc.source === 'vimeo') {
              iframeBlock = `<iframe
                src='https://player.vimeo.com/video/${videoSrc.id}'
                width="560"
                height="315"
                frameBorder="0"
                allowFullScreen="true"
                allow="autoplay; encrypted-media"
                referrerpolicy="origin"
              ></iframe>`
            } else if (videoSrc.source === 'vk') {
              iframeBlock = `<iframe
                src='//vk.com/video_ext.php?oid=-${videoSrc.oid}&id=${videoSrc.id}&hash=c610b6d8e3ef268a'
                width="560"
                height="315"
                frameBorder="0"
                allowFullScreen="true"
                allow="autoplay; encrypted-media"
                referrerpolicy="origin"
              ></iframe>`
            }

            turboItem += iframeBlock
          }

          if (!item.coverImg && !item.videoLink) {
            turboItem += `
              <figure
                data-turbo-ad-id="280846"
                data-platform-mobile="true"
                data-platform-desktop="true"
              >
              </figure>
              ${content}
            `
          } else {
            turboItem += `
              <figure
                data-turbo-ad-id="280846"
                data-platform-mobile="true"
                data-platform-desktop="true"
              >
              </figure>
              ${content}
              <figure
                data-turbo-ad-id="280846"
                data-platform-mobile="true"
                data-platform-desktop="true"
              >
              </figure>
            `
          }

          if (commentsBlock) {
            turboItem += `
            <h3 class="comments-header">Комментарии</h3>
            ${commentsBlock}
            <figure
              data-turbo-ad-id="280846"
              data-platform-mobile="true"
              data-platform-desktop="true"
            >
            </figure>
            `
          }
          turboItem += `
              ]]>
            </turbo:content>
          </item>
          `
          // console.log('turboItem: ', turboItem)
          result.push(turboItem)
        }
      } catch (err) {
        console.log('post:', item)
        console.log(err)
      }
    })
    resolve(result)
  })
}

const excludeTurboUsers = [

]

const getUsers = (data) => {
  console.log('TurboXML Users generation started!')
  const result = data || []
  return new Promise((resolve, reject) => {

    // Exclude some users
    if (excludeTurboUsers.length > 0) {
      for (let i = 0; i < excludeTurboPages.length; i += 1) {
        const today = new Date()
        const UTCstring = today.toUTCString()
        result.push(`<item turbo="false">
          <title>User not found</title>
          <link>${excludeTurboUsers[i]}</link>
          <pubDate>${UTCstring}</pubDate>
          <author>No name</author>
          <turbo:content>
            <![CDATA[
              <header>
                <h1>User not found</h1>
              </header>
            ]]>
          </turbo:content>
        </item>
        `)
      }
    }

    const options = {}
    const fields = {
      'stats.postsCount': { $gt: 0 },
      'isDeleted': { $exists: false }
    }
    options.sort = {
      'profile.lastPostCreated': -1 // Sorted by createdAt descending by default
    }

    const forLastDay = true

    if (forLastDay) {
      const dayAgoDate = new Date()
      const beforeDate = new Date()
      beforeDate.setUTCDate(beforeDate.getDate())
      dayAgoDate.setUTCDate(dayAgoDate.getDate() - 2)
      fields['profile.lastPostCreated'] = {
        $lte: beforeDate,
        $gte: dayAgoDate
      }
    }

    // fields.username = 'polina'

    // options.skip = 0
    // options.limit = 50000
    options.fields = {
      _id: 1,
      createdAt: 1,
      username: 1,
      'profile.name': 1,
      'profile.image': 1,
      'profile.bio': 1,
      'stats.postsCount': 1,
      'stats.booksCount': 1,
      'stats.followersCount': 1,
      'stats.followingCount': 1
    }
    const users = Users.find(fields, options)
    console.log('users: ', users.count())
    users.forEach((item, index) => {
      const optionsP = {}
      optionsP.sort = {
        createdAt: -1
      }
      optionsP.limit = 3
      optionsP.fields = {
        _id: 1,
        title: 1,
        slug: 1,
        coverImg: 1,
        excerpt: 1
      }
      const posts = Posts.find({ userId: item._id, paymentType: { $nin: [1, 2, 3] } }, optionsP).fetch()
      let postsBlock = ''
      if (posts.length > 0) {
        postsBlock = `
          <a href="https://ryfma.com/u/${item.username}?utm_source=yaturbo&utm_medium=usertablink" data-turbo="false" class="user-tab-item active">Последнее</a>
          <a href="https://ryfma.com/u/${item.username}/all?utm_source=yaturbo&utm_medium=usertablink" data-turbo="false" class="user-tab-item">Все</a>
          <div data-block="feed" data-layout="vertical" data-title="">
        `
        const postsLength = posts.length
        for (let i = 0; i < postsLength; i++) {
          const post = posts[i]
          if (!post.title || !post.excerpt) {
            continue
          }
          const slug = post.slug ? post.slug : getSlug(post.title, { lang: 'ru' })
          const link = `https://ryfma.com/p/${post._id}/${slug.replace('"', '')}`.replace('&', '&amp;').replace('"', '&quot;').replace('\'', '&apos;').replace('<br', '')
          let title = post.title.replace(/<br\s+\/>?/gi, '').replace(/\n/gi, '').replace(/"/gi, '').replace('&', '&amp;').replace('"', '&quot;').replace('\'', '&apos;')
          if (title.indexOf('<') > -1 || title.indexOf('>') > -1) {
            title = post.excerpt.split(/<br \/>/)[0].trim()
          }

          const postText = parseText(post.excerpt).replace(/<br \/>/gi, '\n').replace(/&quot;/gi, "'").replace(/[—-🙏🏻✍🏻✍*#!?�]/gi, '')
          postsBlock += `
          <div data-block="feed-item"
            data-href="${link}"
            data-title="${title}"
            data-thumb="${post.coverImg ? post.coverImg : ''}"
            data-thumb-position="top"
            data-thumb-ratio="16x9"
            data-description="${postText}">
          </div>
          `

          if (i === 1 || i % 10 === 0) {
            postsBlock += `<figure
              data-turbo-ad-id="280846"
              data-platform-mobile="true"
              data-platform-desktop="true"
            ></figure>
            `
          }
        }
        postsBlock += `
        </div>`
      }

      const name = item.profile.name || '*'
      const title = name.replace(/[&\/\\#,+()$~%.'":;*?<>{}]/g, '').replace(/✅/gi, '') + ' - стихи, книги, фанфики, рассказы'
      const content = item.profile.bio || ''
      const link = `https://ryfma.com/u/${item.username}`
      let userImg = `<img class='user-avatar' src="https://cdn.ryfma.com/defaults/icons/default_full_avatar.jpg" />`
      if (item.profile.image) {
        userImg = `<img class='user-avatar' src="${item.profile.image}" />`
      }

      let turboItem = `<item turbo="true">
        <title>${title.replace(/&/gi, '')}</title>
        <link>${link}</link>
        <turbo:content>
          <![CDATA[
            <header class="user-info">
              <h1 class="user-name">${item.profile.name}</h1>
            </header>
      `

      turboItem += `
        <div data-block="card">
          <header>
            <h2 class="user-name">${item.profile.name}</h2>
            ${userImg}
          </header>
          <table data-invisible="true" class='user-stats'>
            <tr class='user-stats-digits'><!--Заголовок таблицы-->
              <th><b class='stat-digit'>${item.stats.postsCount}</b></th>
              <th><b class='stat-digit'>${item.stats.booksCount}</b></th>
              <th><b class='stat-digit'>${item.stats.followersCount}</b></th>
              <th><b class='stat-digit'>${item.stats.followingCount}</b></th>
            </tr>
            <tr><!--Строка таблицы-->
              <th>постов</th>
              <th>книг</th>
              <th>читателей</th>
              <th>подписок</th>
            </tr>
          </table>
          <p>${content.substring(0, 137) + '...'}</p>
        </div>
        <figure
          data-turbo-ad-id="280846"
          data-platform-mobile="true"
          data-platform-desktop="true"
        ></figure>
      `
      if (postsBlock) {
        turboItem += `
          ${postsBlock}
          <a href="https://ryfma.com/u/${item.username}?utm_source=yaturbo&utm_medium=readmorelink" data-turbo="false" class="read-more-link turbo-button button_theme_default turbo-button_size_m">Читать далее на Ryfma.com</a><br>
          <figure
            data-turbo-ad-id="280846"
            data-platform-mobile="true"
            data-platform-desktop="true"
          ></figure>
        `
      } else {
        turboItem += `
          <div><b>У автора пока нет постов</b></div>
        `
      }
      turboItem += `
          ]]>
        </turbo:content>
      </item>
      `
      // console.log('turboItem: ', turboItem)
      // return
      result.push(turboItem)
    })
    resolve(result)
  })
}

const getRhymes = (data) => {
  console.log('TurboXML Rhymes generation started!')
  const result = data || []
  return new Promise((resolve, reject) => {
    const options = {}
    const fields = {
      'countUsed': { $gt: 1 }
    }
    options.fields = {
      _id: 1,
      word: 1,
      rhymes: 1
    }
    options.sort = {
      countUsed: -1
    }

    // Max 40000
    // options.skip = 0
    // options.limit = 40000

    const rhymes = Rhymes.find(fields, options)
    console.log('rhymes.count: ', rhymes.count())
    rhymes.forEach(item => {
      // console.log('post: ', item)
      try {
        // console.log('post: ', item)
        // const today = new Date()
        // const UTCstring = today.toUTCString()
        const link = `https://ryfma.com/rhyme/${item.word}`
        const sortedRhymes = item.rhymes.sort()
        const columns = 2
        const elementsInColumn = Math.ceil(sortedRhymes.length / columns)
        let rhymesString = ''
        if (sortedRhymes.length > 4) {
          for (let i = 0; i < columns; i++) {
            let column = ''
            for (let j = 0; j < elementsInColumn; j++) {
              const elemIndex = elementsInColumn * i + j
              const rhyme = sortedRhymes[elemIndex]
              if (rhyme) {
                column += `<i class='rfm-i'>${rhyme}</i>`
              } else {
                column += `<i class='rfm-i'>&nbsp;</i>`
              }
            }
            rhymesString += `<b class='rfm-col'>${column}</b>`
          }
        } else {
          sortedRhymes.map((rhyme, index) => {
            rhymesString += `<i className='rfm-i'>${rhyme}</i>`
          })
        }

        let turboItem = `<item turbo="true">
          <title>Рифма к слову "${item.word}". Найдено - ${sortedRhymes.length} рифм.</title>
          <link>${link}</link>
          <turbo:content>
            <![CDATA[
              <header>
                <h1>Рифма к слову "${item.word}". Найдено - ${sortedRhymes.length} рифм.</h1>
              </header>
              <figure
                data-turbo-ad-id="280846"
                data-platform-mobile="true"
                data-platform-desktop="true"
              >
              </figure>
              <p class="rfm-results">
                ${rhymesString}
              </p>
              <figure
                data-turbo-ad-id="280846"
                data-platform-mobile="true"
                data-platform-desktop="true"
              >
              </figure>
              <a href="https://ryfma.com/rhyme/${item.word}?utm_source=yaturbo&utm_medium=readmorelink" data-turbo="false" class="read-more-link turbo-button button_theme_default turbo-button_size_m">Найти больше рифм на Ryfma.com</a>
            ]]>
          </turbo:content>
        </item>
        `
        // console.log('turboItem: ', turboItem)
        result.push(turboItem)
      } catch (err) {
        console.log('rhyme:', item)
        console.log(err)
      }
    })
    resolve(result)
  })
}

/* const getComments = (data) => {
  console.log('TurboXML Comments generation started!')
  const result = data || []
  return new Promise((resolve, reject) => {
    const options = {}
    const fields = {}
    options.sort = {
      createdAt: -1 // Sorted by createdAt descending by default
    }

    const forLastDay = true

    if (forLastDay) {
      const dayAgoDate = new Date()
      const beforeDate = new Date()
      beforeDate.setUTCDate(beforeDate.getDate())
      dayAgoDate.setUTCDate(dayAgoDate.getDate() - 7)
      fields.createdAt = {
        $lte: beforeDate,
        $gte: dayAgoDate
      }
    }

    options.skip = 0
    // options.limit = 1
    options.fields = {
      _id: 1,
      createdAt: 1,
      userId: 1,
      slug: 1,
      content: 1
    }
    const comments = Comments.find(fields, options)
    comments.forEach((item, index) => {
      const slug = item.slug ? item.slug : '*'
      const optionsU = {}
      optionsU.fields = {
        _id: 1,
        'profile.name': 1
      }
      const author = Users.find({ _id: item.userId }, optionsU).fetch()[0]
      if (author) {
        const today = new Date(item.createdAt)
        const UTCstring = today.toUTCString()
        let title = item.slug.replace(/-/gi, ' ')
        const content = item.content.replace(/<br\s+\/>/gi, '').replace(/\n/gi, '').replace(/�/gi, '').replace(/[{}]/gi, '').replace(/\s\s+/gi, ' ').replace(/<p>\s.*<\/p>/gi, '')
        const link = `https://ryfma.com/c/${item._id}/${slug}`
        const turboItem = `<item turbo="true">
          <title>${title}</title>
          <link>${link.replace('&', '&amp;').replace('"', '&quot;').replace('\'', '&apos;').replace('<br', '')}</link>
          <pubDate>${UTCstring}</pubDate>
          <author>${author.profile.name}</author>
          <turbo:content>
            <![CDATA[
              <header>
                <h1>${title}</h1>
              </header>
              ${item.coverImg ? `<figure>
                <img src="${item.coverImg}">
              </figure>` : ''}
              <figure data-turbo-ad-id="280846"></figure>
              ${content}
              <div data-title="Поделиться" data-block="share" data-network="vkontakte, odnoklassniki, facebook, twitter, telegram"></div>
            ]]>
          </turbo:content>
        </item>
        `
        result.push(turboItem)
      }
    })
    resolve(result)
  })
} */

const createTurboIndex = async (result) => {
  // Инициализируем клиент в режиме отладки. Для боевого режима укажите третьим параметром TurboApi::MODE_PRODUCTION
  const turboMode = 'PRODUCTION'
  const turboAPI = new TurboAPI(config.HOST_ADDRESS, config.OAUTH_TOKEN, turboMode)

  // Получаем у Яндекса необходимые данные для отправки турбостраниц
  await turboAPI.requestUserId()
  await turboAPI.requestHost()
  await turboAPI.requestUploadAddress()

  // лимит числа страниц в рамках одной задачи. В режиме дебага это число ограничено, см. документацию от Яндекса
  const tasksLimit = 5000 // in PROD 10000

  // разбиваем массив турбостраниц на задачи
  const header = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:yandex="http://news.yandex.ru" xmlns:media="http://search.yahoo.com/mrss" xmlns:turbo="http://turbo.yandex.ru">
    <channel>
      <title><![CDATA[${options.title}]]></title>
      <link>${options.link}</link>
      <language>${options.language}</language>
      <description><![CDATA[${options.description}]]></description>
  `
  const footer = `</channel></rss>`

  const tasks = []
  let counter = 0
  let currentTaskXML = ''
  const getTasks = (taskSize = 5) => {
    for (let i = 0; i < result.length; i++) {
      const item = result[i]
      if (counter % taskSize === 0) {
        currentTaskXML = header
      }
      currentTaskXML += item
      if ((counter + 1) % taskSize === 0) {
        currentTaskXML += footer
        tasks.push(currentTaskXML)
      }
      counter++
    }
    if (counter % taskSize !== 0) {
      currentTaskXML += footer
      // console.log('currentTaskXML: ', currentTaskXML)
      tasks.push(currentTaskXML)
    }
  }

  getTasks(tasksLimit)

  // В этом массиве будем хранить id задач, чтобы потом получать информацию по ним
  const taskIds = []
  const brokenTaskIds = []

  // отправляем задачи в Яндекс
  // console.log('tasks: ', tasks.length)
  // console.log('items: ', counter)

  for (let i = 0; i < tasks.length; i++) {
    // setTimeout(async () => {
    // console.log('rss: ', tasks[i])
    const taskUploaded = await turboAPI.uploadRss(tasks[i])
    if (taskUploaded) {
      taskIds.push(taskUploaded)
    } else {
      brokenTaskIds.push(taskUploaded)
    }
    // }, 60000)
  }
  console.log('taskIds: ', taskIds)
  console.log('brokenTaskIds: ', brokenTaskIds)

  // Set a function to run every "interval" seconds a total of "x" times
  if (IS_DEBUG) {
    const x = 10
    const interval = 60000 // 30 sec

    for (let i = 0; i < x; i++) {
      setTimeout(async () => {
        for (let j = 0; j < taskIds.length; j++) {
          const rssStatus = await turboAPI.getTask(taskIds[j])
          console.log(`taskId: ${taskIds[j]} status: ${rssStatus}`)
        }
      }, i * interval)
    }
  }
}

const result = []
const generateTurboXML = () => {
  Promise.all([
    getPosts(result),
    getUsers(result),
    // getRhymes(result)
    // getComments(result)
    // getPages(result),

    /* getBooks(result),
    getBookChapters(result),
    getAsks(result),
    getFestivals(result),
    getEvents(result),
    getDuels(result),
    getAlbums(result),
    getTags(result),
    */
  ])
    .then(async () => {
      console.log('Turbo XML generated!')
      createTurboIndex(result)
    })
}
// generateTurboXML()

const getTasksStatuses = async () => {
  const turboMode = 'PRODUCTION'
  const turboAPI = new TurboAPI(config.HOST_ADDRESS, config.OAUTH_TOKEN, turboMode)

  // Получаем у Яндекса необходимые данные для отправки турбостраниц
  await turboAPI.requestUserId()
  await turboAPI.requestHost()
  await turboAPI.requestUploadAddress()

  setInterval(async () => {
    const getStatusesD = await turboAPI.getTasks('DEBUG', 'PROCESSING', 0, 100)
    console.log('getStatuses DEBUG: ', getStatusesD)
    const getStatusesP = await turboAPI.getTasks('PRODUCTION', 'PROCESSING', 0, 100)
    console.log('getStatuses PRODUCTION: ', getStatusesP)
  }, 20000)
}

// getTasksStatuses()

export { generateTurboXML, getTasksStatuses }
