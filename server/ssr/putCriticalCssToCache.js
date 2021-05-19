import dbCache from '/server/config/redis'
import fs from 'fs'

export default function putCriticalToCache() {
  // const dirPath = process.env.PWD + '/public/critical'
  const dirPath = process.env.NODE_ENV === 'production' ? '/critical/' : process.env.PWD + '/public/critical/'
  fs.readdir(dirPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      fs.readFile(dirPath + file, 'utf8', function(err, contents) {
        // console.log('Critical file: ', file)
        const newPath = 'css_cache' + file.replace(/-/g, '_').replace('.css', '')
        // console.log('newPath: ', newPath)
        // console.log('contents: ', !!contents)
        dbCache.set(newPath, contents, 1000 * 60 * 60 * 24 * 7) // set 7 days cache
      })
    })
  })
}
