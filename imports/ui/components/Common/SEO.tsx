import React from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Meteor } from 'meteor/meteor'

const seoImages = {
  openGraph: 'open-graph-social-2.jpg',
  twitter: 'open-graph-social-2.jpg',
  google: 'open-graph-social-2.jpg'
}

/* const langs = [
  'en', 'fr', 'it', 'de', 'es', 'zh-cn', 'zh-tw', 'ja', 'ko', 'pt', 'pt-br', 'af', 'cs', 'da', 'el', 'fi', 'hr', 'hu', 'id', 'ms', 'nb', 'nl', 'pl', 'ru', 'sk', 'sv', 'th', 'tl', 'tr', 'hi', 'bn', 'gu', 'kn', 'ml', 'mr', 'pa', 'ta', 'te', 'ne', 'si', 'ur', 'vi', 'bg', 'ro', 'sr', 'uk', 'zh-hk'
] */

const langs = [
  'ru', 'en' // , 'fr', 'it', 'de', 'es'
]

const seoImageURL = file => `https://cdn.ryfma.com/defaults/icons/${file}`
const seoURL = path => Meteor.absoluteUrl(path).replace(/\/$/, '')

const getMetaTags = ({
  title, description, image, url, contentType, published, updated, category, tags, twitter, author, ISBN, year, first_name, last_name, username, gender, publisher, noIndex, noFollow, type
}) => {
  const desc = description ? description.replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<br(\s)?\/>/g, '').replace(/\\n/g, '').substring(0, 289) : first_name + ' ' + last_name
  const imageSrc = image || seoImageURL(seoImages.openGraph)
  const prefix = 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# profile: http://ogp.me/ns/profile#'
  let emoji = ''
  if (type === 'post') {
    emoji = '📌 ' 
  } else if (type === 'rhyme') {
    emoji = '💥 '
  } else if (type === 'book') {
    emoji = '📗 '
  } else if (type === 'contest') {
    emoji = '🏆 '
  } else if (type === 'ask') {
    emoji = '❓ '
  }

  const metaTags = [
    { itemProp: 'name', content: title },
    { itemProp: 'title', content: title },
    { itemProp: 'description', content: desc },
    { itemProp: 'keywords', content: `${tags ? tags + ', ' : ''}Ryfma, рифма, рифма ком, рифмаком, рифма сайт, рифма ру, рифмару` },
    { name: 'title', content: title },
    { name: 'description', content: desc },
    { name: 'keywords', content: `${tags ? tags + ', ' : ''}Ryfma, рифма, рифма ком, рифмаком, рифма сайт, рифма ру, рифмару` },

    { name: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:site', content: '@Ryfma' },
    { property: 'twitter:title', content: `${emoji}${title}` },
    { property: 'twitter:url', content: `${url}` },
    { property: 'twitter:description', content: desc },
    { property: 'twitter:creator', content: `@${twitter || 'ryfma'}` },

    { prefix: prefix, property: 'og:title', content: `${emoji}${title}` },
    { prefix: prefix, property: 'og:type', content: contentType },
    { prefix: prefix, property: 'og:url', content: url },
    { prefix: prefix, property: 'og:description', content: desc },
    { prefix: prefix, property: 'og:site_name', content: 'Ryfma' },
    { property: 'fb:app_id', content: '1127643753917982' }
  ]

  if (imageSrc) {
    metaTags.push({ itemProp: 'image', content: imageSrc })
    metaTags.push({ itemProp: 'image_src', content: imageSrc })
    metaTags.push({ property: 'twitter:image', content: imageSrc })
    metaTags.push({ prefix: prefix, property: 'og:image', content: imageSrc })
    metaTags.push({ prefix: prefix, property: 'og:image:url', content: imageSrc })
    metaTags.push({ prefix: prefix, property: 'og:image:secure_url', content: imageSrc })
    metaTags.push({ prefix: prefix, property: 'og:image:alt', content: title })
  }

  if (contentType === 'article') {
    metaTags.push({ property: 'article:publisher', content: 'https://www.facebook.com/ryfma' })

    if (image) {
      metaTags.push({ prefix: prefix, property: 'og:image:width', content: 1200 })
      metaTags.push({ prefix: prefix, property: 'og:image:height', content: 442 })
    }

    if (author) metaTags.push({ property: 'article:author', content: author })
    if (published) metaTags.push({ property: 'article:published_time', content: published })
    if (updated) metaTags.push({ property: 'article:modified_time', content: updated })
    if (category) metaTags.push({ property: 'article:section', content: category })
    if (tags) {
      try {
        const tagsArr = tags.split(',')
        tagsArr.map(tag => metaTags.push({ property: 'article:tag', content: tag.trim() }))
      } catch (err) {
        metaTags.push({ property: 'article:tag', content: tags })
      }
    }
  } else if (contentType === 'book') {
    if (author) metaTags.push({ property: 'book:author', content: author })
    if (ISBN) metaTags.push({ property: 'book:isbn', content: ISBN })
    if (year) metaTags.push({ property: 'book:release_date', content: year })
    if (tags) {
      try {
        const tagsArr = tags.split(',')
        tagsArr.map(tag => metaTags.push({ property: 'book:tag', content: tag.trim() }))
      } catch (err) {
        metaTags.push({ property: 'article:tag', content: tags })
      }
    }
  } else if (contentType === 'profile') {
    if (first_name) metaTags.push({ property: 'profile:first_name', content: first_name })
    if (last_name) metaTags.push({ property: 'profile:last_name', content: last_name })
    if (username) metaTags.push({ property: 'profile:username', content: username })
    if (gender) metaTags.push({ property: 'profile:gender', content: gender })

    // metaTags.push({ property: 'al:ios:url', content: `ryfma://user?username=${username}` })
    // metaTags.push({ property: 'al:android:url', content: `https://ryfma.com/_u/${username}/` })
  }

  if (noIndex) {
    metaTags.push({ name: 'robots', content: 'noindex' })
  }

  if (noFollow) {
    metaTags.push({ name: 'robots', content: 'nofollow' })
  }

  if (!(noIndex && noFollow)) {
    metaTags.push({ name: 'robots', content: 'index, follow'})
    metaTags.push({ name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'})
    metaTags.push({ name: 'bingbot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'})
  }

  return metaTags
}

const getLinksTags = (path, contentType, username, onlyLang, currLang, hasAMP = false, isAMP) => {
  let ampPath = path
  if (isAMP) {
    ampPath = 'amp/' + ampPath
  }

  const links = [
    { rel: 'canonical', href: seoURL(path) },
    { rel: 'alternate', href: seoURL(ampPath), hreflang: 'x-default' }
  ]

  if (hasAMP && !isAMP) {
    links.push({ rel: 'amphtml', href: seoURL('/amp/' + path)})
  }

  if (contentType === 'profile') {
    links.push({ rel: 'alternate', href: `android-app://com.ryfma.android/https/ryfma.com/_u/${username}` })
  }

  if (onlyLang) {
    links.push({ rel: 'alternate', href: `${seoURL(path)}?hl=${onlyLang}`, hreflang: onlyLang })
  } else {
    langs.map(lang => {
      links.push({ rel: 'alternate', href: `${seoURL(ampPath)}?hl=${lang}`, hreflang: lang })
      /* if (lang.indexOf('es-') > -1) {
        links.push({ rel: 'alternate', href: `${seoURL(path)}?hl=es`, hreflang: lang })
      } else {
        links.push({ rel: 'alternate', href: `${seoURL(path)}?hl=${lang}`, hreflang: lang })
      } */
    })
  }

  return links
}

const SEO = ({
  schema, title, description, image, path, contentType, published, updated, category, tags, twitter, author, ISBN, year, first_name, last_name, username, gender, onlyLang, noIndex, noFollow, hasAMP, isAMP, type
}) => {
  const [i18n] = useTranslation()
  const pathArr = path.split('?')
  let clearPath = path
  if (pathArr.length > 1) {
    clearPath = pathArr[0]
  }
  return (<Helmet
      key={clearPath}
      htmlAttributes={{
        lang: i18n.language || 'ru',
        'xml:lang': i18n.language || 'ru',
        itemscope: null,
        itemtype: clearPath === '/' ? null : `https://schema.org/${schema}`,
        xmlns: 'http://www.w3.org/1999/xhtml',
        prefix: 'og: http://ogp.me/ns# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile# fb: http://ogp.me/ns/fb#'
      }}
      title={title}
      link={getLinksTags(clearPath, contentType, username, onlyLang, i18n.language, hasAMP, isAMP)}
      meta={getMetaTags({
        title,
        description,
        image,
        contentType,
        url: seoURL(clearPath),
        published,
        updated,
        category,
        tags,
        twitter,
        author,
        ISBN,
        year,
        first_name,
        last_name,
        username,
        gender,
        noIndex,
        noFollow,
        type
      })}
    />)
}

export default SEO
