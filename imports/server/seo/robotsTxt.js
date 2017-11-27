import { Meteor } from 'meteor/meteor'

const robotsTxt = () =>
`User-agent: *
Disallow: /protected
Sitemap: ${Meteor.absoluteUrl()}sitemaps/sitemap-index.html`

export default robotsTxt
