import React from 'react'
import { Helmet } from 'react-helmet'
import { Meteor } from 'meteor/meteor'
import store from '/lib/store'

const seoImages = {
  openGraph: 'open-graph-social.jpg',
  twitter: 'open-graph-social.jpg',
  google: 'open-graph-social.jpg'
}

const seoImageURL = file => `https://cdnryfma.s3.amazonaws.com/defaults/icons/${file}`
const seoURL = path => Meteor.absoluteUrl(path)

const getMetaTags = ({
  title, description, image, url, contentType, published, updated, category, tags, twitter, author, ISBN, year, first_name, last_name, username, gender
}) => {
  const desc = description ? description.replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<br(\s)?\/>/g, '').replace(/\\n/g, '').substring(0, 289) : first_name + ' ' + last_name
  const metaTags = [
    { itemProp: 'name', content: title },
    { itemProp: 'description', content: desc },
    { itemProp: 'keywords', content: tags || '' },
    { itemProp: 'image', content: image || seoImageURL(seoImages.google) },
    { name: 'description', content: desc },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@most' },
    { name: 'twitter:title', content: `${title}` },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:creator', content: `@${twitter || 'most'}` },
    { name: 'twitter:image:src', content: image || seoImageURL(seoImages.twitter) },
    { name: 'og:title', content: `${title}` },
    { name: 'og:type', content: contentType },
    { name: 'og:url', content: url },
    { name: 'og:image', content: image || seoImageURL(seoImages.openGraph) },
    { name: 'og:image:secure_url', content: image || seoImageURL(seoImages.openGraph) },
    { name: 'og:description', content: desc },
    { name: 'og:site_name', content: 'MO.ST' },
    { name: 'fb:app_id', content: '1127643753917982' }
  ]

  if (contentType === 'article') {
    if (published) metaTags.push({ name: 'article:published_time', content: published })
    if (updated) metaTags.push({ name: 'article:modified_time', content: updated })
    if (category) metaTags.push({ name: 'article:section', content: category })
  } else if (contentType === 'profile') {
    if (first_name) metaTags.push({ name: 'profile:first_name', content: first_name })
    if (last_name) metaTags.push({ name: 'profile:last_name', content: last_name })
    if (username) metaTags.push({ name: 'profile:username', content: username })
    if (gender) metaTags.push({ name: 'profile:gender', content: gender })
  }

  return metaTags
}

const SEO = ({
  schema, title, description, image, path, contentType, published, updated, category, tags, twitter, author, ISBN, year, first_name, last_name, username, gender
}) => (
  <Helmet
    htmlAttributes={{
      lang: typeof window !== 'undefined' ? store.getItem('i18nextLng') || 'ru' : 'ru',
      itemscope: undefined,
      itemtype: `http://schema.org/${schema}`
    }}
    title={title}
    link={[
      { rel: 'canonical', href: seoURL(path) }
    ]}
    meta={getMetaTags({
      title,
      description,
      image,
      contentType,
      url: seoURL(path),
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
      gender
    })}
  />
)

export default SEO
