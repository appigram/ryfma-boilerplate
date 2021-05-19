import {
  Meteor
} from 'meteor/meteor'
// import rendererSync from './rendererSync'
import renderer from './renderer'

const fs = require('fs')
const pathLib = require('path')
const {
  performance
} = require('perf_hooks')
const critical = require('critical')
const CleanCSS = require('clean-css')

// create pre-rendered landing pages with critical CSS.
// do this AFTER the above so that the onPageLoad handler still exists if there is a problem below...

const ssrPaths = [
  // Landings

  /* '/',
  '/login',
  '/signup',
  '/recover-password',
  '/sponsors',
  '/search/users/test',
  '/search/posts/test',
  '/404',
  '/explore',


  // Pages hub
  '/e/all',
  '/d/all',
  '/f/all',
  '/upgrade',
  '/fairytails',
  '/faq',
  '/ask/all',
  '/classic',
  '/authors',
  '/blog',
  '/search',  */

  // Pages
  /*
  '/u/stanislav-mikhailenko',
  '/u/polina',
  '/u/polina/albums',
  '/u/polina/books',
  '/u/polina/followers',
  '/e/simfotvorenie2',
  '/tagsmap',
  '/live',
  '/u/omar-khaiyam',
  '/u/polina',
  '/u/stanislav-mikhailenko',
  '/u/vladislav-demarchuk'
  '/blog',
  '/blog/PEWdq2n75dBcXBtT9/mini-prilozhenie-ryfma-vkontakte-vk-mini-apps'
  '/explore',
  '/coronavirus',

  '/u/polina/all',
  '/u/polina/albums',
  '/u/polina/books',
  '/u/polina/followers',
  '/f/est-lyudi-kak-lyudi',
  '/f/romantic2'
  '/d/PJKjp4e3Z4gvT4jMD/o-proshlom-lyubvi-i-rasstavanii',
  '/ask/8s9G3cyxrJnGpKGH4/problemy-s-karmoi',
  '/album/53age6qFQMRJ6LLgC/popytki-prozy',

  '/upgrade',

  '/ch/W8JCa3dMRmu8Sstbe',
  '/ch/aQYzgNbTyTzNx27hc',
  '/ch/DvCHKscSTacAPwxr3',
  '/ch/2uN9onoYcxzFsJkN5',
  '/ch/4nDStTF7ZYd3uq3Bg'

  '/b/s2fNXxnisWN97bogY/vedmino-serdce',
  '/b/FQr3gYFkJaTF6i6aG/pod-kozhei',
  '/b/ZvAfQYPNyN8xjEp2F/sem-smertnykh-grekhov',
  '/b/xi7wLYGw2Kuw6vvbt/bend-with-the-wind'

  '/rhyme',
  '/rhyme/стихи',
  '/rhyme/солнце',

   '/tags/Wtd8LFGZRivNu3Dii/%D0%A1%D1%82%D0%B8%D1%85%D0%B8%20%D0%BE%20%D0%BB%D1%8E%D0%B1%D0%B2%D0%B8',
   '/tags/TaxLCBaa59m4xydpt/poems'

   '/books/all',
   '/books/free',
   '/books/paid',

   '/u/polina',
   '/u/omar-khaiyam',
   '/u/stanislav-mikhailenko',
   '/u/vladislav-demarchuk'

   */

  // '/latest',
  // '/hot',
  // '/best',
  // '/picks'

  "/"
]

const dirPath = process.env.NODE_ENV === 'production' ? '/critical/' : process.env.PWD + '/public/critical/'

const processPath = async (path, params, defaultDimensions, isMobile) => {
  console.log('ssr', 'pre-rendering ', path, 'isMobile', isMobile)
  const dimensions = defaultDimensions.split(',').map(dims => {
    const [width, height] = dims.split('x')
    return {
      width,
      height
    }
  })
  // let now = performance.now();
  const syncGenerate = Meteor.wrapAsync(critical.generate, critical)

  let cssPath = __meteor_bootstrap__.serverDir.replace('/server', '/web.browser')
  cssPath += "/" + fs.readdirSync(cssPath).find(file => file.slice(-4) == ".css")

  const { html } = await renderer(params)

  /* const preData = {
    initData,
    css: '',
    html // html.replace(/( data-v-\w{8}|<!--.*?-->)/g, '')
  } */

  // console.log('SSR HTML', ("    " + (performance.now() - now).toFixed(3)).slice(-9), 'got html:', preData.html.length, 'bytes')

  // now = performance.now()

  const res = syncGenerate({
    base: '/',
    rebase: false, // needs critical@2+ https://github.com/addyosmani/critical/issues/359#issuecomment-470019922
    html,
    css: cssPath,
    dimensions,
    minify: true,
    penthouse: { timeout: 120000 }
    //penthouse: {forceInclude: [/mdl-layout__drawer-button/]},
  })

  if (res && res.css) {
    const clean = new CleanCSS({ level: 2 }).minify(res.css)
    console.log('params path: ', params.path)
    var pathToCriticalFile = pathLib.join(dirPath, `${params.path.replace(/\//g, '_')}${isMobile ? '_min' : ''}.css`)
    console.log('Writing to - ', pathToCriticalFile)
    fs.writeFileSync(pathToCriticalFile, clean.styles, { flag: 'w' })
    // console.log('SSR CSS', ("     " + (performance.now() - now).toFixed(3)).slice(-9), 'got css:', preData.css && preData.css.length, 'bytes', params.path)
  }
}

const generateCriticalCSS = () => {
  console.log('=== START prepareCriticalCSS ===')
  const settingsContext = {
    locale: 'ru',
    rTheme: 'sun',
    readCookie: 0,
    readAnounce: 0,
    readWebPush: 0,
    isMobile: false,
    isTablet: false
  }

  const authContext = {
    token: null // 'Mk0gP8At4DbVaxRf-jbzb0dN2fRwi1KEc1wI_SRVwaJ'
  }

  ssrPaths.map(path => {
    let preKey = {
      path,
      isAMP: false,
      locale: settingsContext.locale,
      rTheme: settingsContext.rTheme,
      isMobile: settingsContext.isMobile,
      isTablet: settingsContext.isTablet,
    }

    const key = JSON.stringify(preKey).replace(/[{}"]/g, '').replace(/[:,]/g, '_')
    let params = {
      path,
      key,
      settingsContext,
      authContext
    }
    const defaultDimensions = '1920x2160,1024x1538,960x1920'
    processPath(path, params, defaultDimensions, false)

    params.settingsContext.isMobile = true
    const ampMobileDimensions = '600x3600,320x19840'
    processPath(path, params, ampMobileDimensions, true)
  })

  console.log('=== FINISH prepareCriticalCSS ===')
}

const mergeFiles = (files, toFile) => {
  let sharedCSS = ''
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    if (file !== 'common.css') {
      const contents = fs.readFileSync(dirPath + file, 'utf8')
      sharedCSS += contents
    }
  })
  const cleanCSS = new CleanCSS({ level: 2 }).minify(sharedCSS)
  console.log('cleanCss: ', cleanCSS.stats)
  var pathToCommonFile = pathLib.join(dirPath, toFile)
  console.log('Save to file: ', toFile)
  fs.writeFile(pathToCommonFile, cleanCSS.styles, { flag: 'w' }, function (err) {
    if (err) {
      return console.log(err)
    }
  })
}

const joinCss = () => {
  /* fs.readdir(dirPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    mergeFiles(files, 'common.css')
  }) */

  /* const mergeCSSFiles = [
    '_search.css',
    '_search_posts_test.css',
    '_search_users_test.css'
  ]
  mergeFiles(mergeCSSFiles, '_search.css')

 */

  /* const mergeCSSFiles31 = [
    '_rhyme_min.css',
    '_rhyme_стихи_min.css',
    '_rhyme_солнце_min.css'
  ]
  mergeFiles(mergeCSSFiles31, '_rhyme_min.css1')
 
 
  const mergeCSSFiles32 = [
    '_rhyme.css',
    '_rhyme_стихи.css',
    '_rhyme_солнце.css'
  ]
  mergeFiles(mergeCSSFiles32, '_rhyme.css1') */

  /* const mergeCSSFiles51 = [
     '_f_est-lyudi-kak-lyudi.css',
     '_f_romantic2.css'
   ]
   mergeFiles(mergeCSSFiles51, '_fest.css')
 
   const mergeCSSFiles52 = [
     '_f_est-lyudi-kak-lyudi_min.css',
     '_f_romantic2_min.css'
   ]
   mergeFiles(mergeCSSFiles52, '_fest_min.css') */


  /* const mergeCSSFiles2 = [
    '_p_NFwML5HWhwZBJncpF_pogovori-so-mnoi.css',
    '_p_W35KKZsRZr4rzmzDr_10-000-metrov.css',
    '_p_cjjY86s5Wm5BTJkL9_slushai-u-menya-nikakikh-sil.css'
  ]
  mergeFiles(mergeCSSFiles2, '_post.css')

  const mergeCSSFiles2min = [
    '_p_NFwML5HWhwZBJncpF_pogovori-so-mnoi_min.css',
    '_p_W35KKZsRZr4rzmzDr_10-000-metrov_min.css',
    '_p_cjjY86s5Wm5BTJkL9_slushai-u-menya-nikakikh-sil_min.css'
  ]
  mergeFiles(mergeCSSFiles2min, '_post_min.css') */

  /* const mergeCSSFiles40 = [
    '_u_polina.css',
    '_u_omar-khaiyam.css',
    // '_u_polina_all.css',
    // '_u_polina_albums.css',
    // '_u_polina_books.css',
    // '_u_polina_followers.css',
    '_u_stanislav-mikhailenko.css',
    '_u_vladislav-demarchuk.css',

  ]
  mergeFiles(mergeCSSFiles40, '_user.css')


   const mergeCSSFiles4 = [
    '_u_polina_min.css',
    '_u_omar-khaiyam_min.css',
    // '_u_polina_all_min.css',
    // '_u_polina_albums_min.css',
    // '_u_polina_books_min.css',
    // '_u_polina_followers_min.css',
    '_u_stanislav-mikhailenko_min.css',
    '_u_vladislav-demarchuk_min.css'
  ]
  mergeFiles(mergeCSSFiles4, '_user_min.css') */

  /* const mergeCSSFiles31 = [
    '_rhyme_min.css',
    '_rhyme_стихи_min.css',
    '_rhyme_солнце_min.css'
  ]
  mergeFiles(mergeCSSFiles31, '_rhyme_min.css')

  const mergeCSSFiles32 = [
    '_rhyme.css',
    '_rhyme_стихи.css',
    '_rhyme_солнце.css'
  ]
  mergeFiles(mergeCSSFiles32, '_rhyme.css') */

  /* const mergeCSSFiles71 = [
    '_d_PJKjp4e3Z4gvT4jMD_o-proshlom-lyubvi-i-rasstavanii_min.css',
  ]
  mergeFiles(mergeCSSFiles71, '_duel_min.css')

  const mergeCSSFiles72 = [
    '_d_PJKjp4e3Z4gvT4jMD_o-proshlom-lyubvi-i-rasstavanii.css',
  ]
  mergeFiles(mergeCSSFiles72, '_duel.css')

  const mergeCSSFiles81 = [
    '_ask_8s9G3cyxrJnGpKGH4_problemy-s-karmoi_min.css',
  ]
  mergeFiles(mergeCSSFiles81, '_ask_min.css')

  const mergeCSSFiles82 = [
    '_ask_8s9G3cyxrJnGpKGH4_problemy-s-karmoi.css',
  ]
  mergeFiles(mergeCSSFiles82, '_ask.css')

  const mergeCSSFiles91 = [
    '_album_53age6qFQMRJ6LLgC_popytki-prozy_min.css',
  ]
  mergeFiles(mergeCSSFiles91, '_album_min.css')

  const mergeCSSFiles92 = [
    '_album_53age6qFQMRJ6LLgC_popytki-prozy.css',
  ]
  mergeFiles(mergeCSSFiles92, '_album.css') */

  /* const mergeCSSFiles101 = [
    '_books_all_min.css',
    '_books_free_min.css',
    '_books_paid_min.css',
  ]
  mergeFiles(mergeCSSFiles101, '_books_min.css')

  const mergeCSSFiles102 = [
    '_books_all.css',
    '_books_free.css',
    '_books_paid.css'
  ]
  mergeFiles(mergeCSSFiles102, '_books.css') */

  /* const mergeCSSFiles51 = [
    '_b_s2fNXxnisWN97bogY_vedmino-serdce_min.css',
    '_b_FQr3gYFkJaTF6i6aG_pod-kozhei_min.css',
    '_b_xi7wLYGw2Kuw6vvbt_bend-with-the-wind_min.css',
    '_b_ZvAfQYPNyN8xjEp2F_sem-smertnykh-grekhov_min.css'
  ]
  mergeFiles(mergeCSSFiles51, '_book_min.css')

  const mergeCSSFiles52 = [
    '_b_s2fNXxnisWN97bogY_vedmino-serdce.css',
    '_b_FQr3gYFkJaTF6i6aG_pod-kozhei.css',
    '_b_xi7wLYGw2Kuw6vvbt_bend-with-the-wind.css',
    '_b_ZvAfQYPNyN8xjEp2F_sem-smertnykh-grekhov.css'
  ]
  mergeFiles(mergeCSSFiles52, '_book.css') */

  /* const mergeCSSFiles61 = [
    '_ch_W8JCa3dMRmu8Sstbe_min.css',
    '_ch_aQYzgNbTyTzNx27hc_min.css',
    '_ch_2uN9onoYcxzFsJkN5_min.css',
    '_ch_DvCHKscSTacAPwxr3_min.css',
    '_ch_4nDStTF7ZYd3uq3Bg_min.css'
  ]
  mergeFiles(mergeCSSFiles61, '_chapter_min.css')

  const mergeCSSFiles62 = [
    '_ch_W8JCa3dMRmu8Sstbe.css',
    '_ch_aQYzgNbTyTzNx27hc.css',
    '_ch_2uN9onoYcxzFsJkN5.css',
    '_ch_DvCHKscSTacAPwxr3.css',
    '_ch_4nDStTF7ZYd3uq3Bg.css'
  ]
  mergeFiles(mergeCSSFiles62, '_chapter.css') */

  /* const mergeCSSFiles111 = [
    '_tags_Wtd8LFGZRivNu3Dii_%D0%A1%D1%82%D0%B8%D1%85%D0%B8%20%D0%BE%20%D0%BB%D1%8E%D0%B1%D0%B2%D0%B8_min.css',
    '_tags_TaxLCBaa59m4xydpt_poems_min.css'
  ]
  mergeFiles(mergeCSSFiles111, '_tags_min.css')


  const mergeCSSFiles112 = [
    '_tags_Wtd8LFGZRivNu3Dii_%D0%A1%D1%82%D0%B8%D1%85%D0%B8%20%D0%BE%20%D0%BB%D1%8E%D0%B1%D0%B2%D0%B8.css',
    '_tags_TaxLCBaa59m4xydpt_poems.css'
  ]
  mergeFiles(mergeCSSFiles112, '_tags.css') */

}

export { generateCriticalCSS, joinCss }
