import Fiber from 'fibers'

export const formatBytes = (bytes, decimals) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const profiling = () => {
  setInterval(() => {
    const { rss, heapTotal, heapUsed } = process.memoryUsage()
    const { fibersCreated, poolSize } = Fiber

    console.log('heapUsed: ', formatBytes(heapUsed))
    console.log('heapTotal: ', formatBytes(heapTotal))
    console.log('rss: ', formatBytes(rss))
    console.log('poolSize: ', poolSize)
    console.log('fibersCreated: ', fibersCreated)
    console.log('!=====================================!')
  }, 5000).unref()
}

const testGet = async () => {
  return {
    foo: 'foo',
    bar: 'bar'
  }
}

export const testRun = async () => {
  let idx = 0
  const thresh = 1e5
  const limit = 1e6
  while (idx++ < limit) {
    const record = await testGet()
    if (idx % thresh === 0) {
      console.log('heap-used:', process.memoryUsage().heapUsed)
    }
  }
}
