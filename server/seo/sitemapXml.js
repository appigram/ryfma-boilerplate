import path from 'path'
import { createWriteStream, mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { SitemapIndexStream, SitemapStream, SitemapAndIndexStream } from 'sitemap'

import uploadToS3 from '/server/utils/uploadToS3'
import findFilesInDir from '/server/utils/findFilesInDir'

import getAlbums from './sitemaps/getAlbums'
import getAsks from './sitemaps/getAsks'
import getBookChapters from './sitemaps/getBookChapters'
import getBooks from './sitemaps/getBooks'
import getContests from './sitemaps/getContests'
import getDuels from './sitemaps/getDuels'
import getEvents from './sitemaps/getEvents'
import getPosts from './sitemaps/getPosts'
import getRhymes from './sitemaps/getRhymes'
import getTags from './sitemaps/getTags'
import getUsers from './sitemaps/getUsers'

const config = {
  HOST: 'https://ryfma.com',
  NAME: process.env.NAME || 'sitemap',
  // GZIP: true, // process.env.GZIP === 'true',
  SIZE: 40000, // +process.env.SIZE || 25000,
  // DST: process.env.DST || path.resolve(tmpdir() + '/ryfma/sitemaps')
  DST: path.resolve('/Users/macbook/projects/ryfma/webApp/server/seo/tmp')
}

/* const writeSitemapToFile = (links, linksName) => {
  console.log(`== Start writing "${linksName}" ==`)
  const sitemap = new SitemapStream({ hostname: config.HOST, xmlns: { news: false, xhtml: true, image: false, video: false }})
  for (var year in links) {
    let yearLinks = links[year]
    let xmlPath = `${config.DST}/${linksName}/${year}/`
    let sitemapName = xmlPath + config.NAME
    mkdirSync(xmlPath, { recursive: true })
    // Create a stream to write to
    console.log('yearLinks.length: ', yearLinks.length)
    if (yearLinks.length > config.SIZE) {
      const maxSitemaps = Math.round(yearLinks.length / config.SIZE)
      console.log('maxSitemaps: ', maxSitemaps)
      let multiSitemapName = xmlPath + config.NAME
      for (let i = 0; i < maxSitemaps; i++) {
        sitemapName = multiSitemapName + '-' + i
        // console.log(`Writing ${config.SIZE} items for ${year} year`)
        sitemap.pipe(createWriteStream(sitemapName + '.xml'))
        for (let j = config.SIZE * i; j < config.SIZE; j++) {
          sitemap.write(yearLinks[j])
        }
      }

      const restItems = yearLinks.length - (maxSitemaps * config.SIZE)
      console.log('restItems: ', restItems)
      if (restItems > 0) {
        const sitemap = new SitemapStream({ hostname: config.HOST, xmlns: { news: false, xhtml: true, image: false, video: false }})
        sitemapName = multiSitemapName + '-' + (maxSitemaps + 1)
        sitemap.pipe(createWriteStream(sitemapName + '.xml'))
        for (let k = maxSitemaps * config.SIZE; k < yearLinks.length; k++) {
          sitemap.write(yearLinks[k])
        }
      }
    } else {
      sitemap.pipe(createWriteStream(sitemapName + '.xml'))
      console.log(`Writing ${yearLinks.length} items for ${year} year`)
      for (let j = 0; j < yearLinks.length; j++) {
        sitemap.write(yearLinks[j])
      }
    }
  }
  console.log(`== Finish writing "${linksName}" ==`)
  sitemap.end()
} */

const writeSitemapToFile = (links, linksName) => {
  console.log(`== Start writing "${linksName}" ==`)
  for (var year in links) {
    let yearLinks = links[year]
    console.log(`Writing items for ${year}: ${yearLinks.length}`)
    let xmlPath = `${config.DST}/${linksName}/${year}/`
    mkdirSync(xmlPath, { recursive: true })

    const sitemap = new SitemapAndIndexStream({
      limit: 45000, // defaults to 45k
      // SitemapAndIndexStream will call this user provided function every time
      // it needs to create a new sitemap file. You merely need to return a stream
      // for it to write the sitemap urls to and the expected url where that sitemap will be hosted
      getSitemapStream: (i) => {
        const sitemapStream = new SitemapStream({
          hostname: config.HOST,
        })

        const sitemapName = i === 0 ? `${xmlPath}/sitemap.xml` : `${xmlPath}/sitemap-${i}.xml`

        sitemapStream.pipe(createWriteStream(sitemapName)) // write it to sitemap-NUMBER.xml

        return [
          new URL(`sitemap-${i}.xml`, `${config.HOST}/sitemap/${linksName}/${year}/`).toString(),
          sitemapStream,
        ]
      }
    })

    yearLinks.forEach((item) => sitemap.write(item))

    sitemap.end()
  }
  console.log(`== Start writing "${linksName}" ==`)
}

const createSitemapIndex = () => {
  const smis = new SitemapIndexStream({ level: 'warn' })
  const writeStream = createWriteStream(`${config.DST}/sitemap-index.xml`)
  smis.pipe(writeStream)

  const files = findFilesInDir(config.DST, /\.xml$/)

  for (let filePath of files) {
    const xmlPath = `https://ryfma.com/sitemap${filePath.replace(config.DST, '')}`
    if (xmlPath !== 'https://ryfma.com/sitemap/sitemap-index.xml') {
      console.log('xmlPath: ', xmlPath)
      smis.write({ url: xmlPath, lastmod: new Date() })
    }
  }
  smis.end()
}

const generateSitemap = Meteor.bindEnvironment(() => {
  /* writeSitemapToFile(getAlbums(config), 'albums')

  writeSitemapToFile(getAsks(config), 'asks')

  writeSitemapToFile(getBooks(config), 'books')

  writeSitemapToFile(getBookChapters(config), 'chapters')

  writeSitemapToFile(getContests(config), 'contests')

  writeSitemapToFile(getDuels(config), 'duels')

  writeSitemapToFile(getEvents(config), 'events') */

  // writeSitemapToFile(getRhymes(config), 'rhymes')

  // writeSitemapToFile(getTags(config), 'tags')

  // writeSitemapToFile(getUsers(config), 'users')

  // writeSitemapToFile(getPosts(config), 'posts')

  // createSitemapIndex()

  // uploadToS3(config.DST, 'sitemaps')

})

// generateSitemap()
// createSitemapIndex()

export { generateSitemap }
