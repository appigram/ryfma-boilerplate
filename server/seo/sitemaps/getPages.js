const getPages = (data) => {
  console.log('Pages generation started!')
  const result = data || [];
  [].push.apply(result, [
    { url: config.HOST + '/', changefreq: 'always', priority: 1 },
    { url: config.HOST + '/rhyme', changefreq: 'weekly', priority: 0.9 },
    // { url: config.HOST + '/levitan', changefreq: 'never' },
    { url: config.HOST + '/latest', changefreq: 'always', priority: 0.9 },
    { url: config.HOST + '/books/all', changefreq: 'daily', priority: 0.9 },
    { url: config.HOST + '/f/all', changefreq: 'daily', priority: 0.9 },
    { url: config.HOST + '/d/all', changefreq: 'daily', priority: 0.9 },
    { url: config.HOST + '/e/all', changefreq: 'daily', priority: 0.9 },
    { url: config.HOST + '/ask/all', changefreq: 'daily', priority: 0.9 },
    { url: config.HOST + '/best', changefreq: 'daily', priority: 0.9 },
    { url: config.HOST + '/tags', changefreq: 'daily', priority: 0.9 },
    { url: config.HOST + '/authors', changefreq: 'daily', priority: 0.9 },
    { url: config.HOST + '/fairytails', changefreq: 'daily', priority: 0.9 },
    { url: config.HOST + '/classic', changefreq: 'daily', priority: 0.9 },
    { url: config.HOST + '/aboutus', changefreq: 'monthly', priority: 0.2 },
    { url: config.HOST + '/faq', changefreq: 'monthly', priority: 0.2 },
    { url: config.HOST + '/press', changefreq: 'monthly', priority: 0.2 },
    { url: config.HOST + '/terms', changefreq: 'monthly', priority: 0.2 },
    { url: config.HOST + '/blog', changefreq: 'weekly', priority: 0.6 },
    { url: config.HOST + '/cover-design', changefreq: 'never', priority: 0.2 },
  ])

  return new Promise(resolve => resolve(result))
}

export default getPages
