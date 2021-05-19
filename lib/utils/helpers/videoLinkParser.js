const videoLinkParser = (url) => {
  let videoLink = {}
  const defaultImg = 'https://cdn.ryfma.com/defaults/icons/default_back_full.jpg'
  // Youtube link
  const regExpYoutube = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/i
  const matchY = url.match(regExpYoutube)
  if (matchY) {
    videoLink.source = 'youtube'
    videoLink.id = (matchY && matchY[7].length === 11) ? matchY[7] : false
    videoLink.img = `https://i.ytimg.com/vi/${videoLink.id}/default.jpg`
    videoLink.mqImg = `https://i.ytimg.com/vi/${videoLink.id}/mqdefault.jpg`
    videoLink.hqImg = `https://i.ytimg.com/vi/${videoLink.id}/hqdefault.jpg`
  }

  // Vimeo link
  const regExpVimeo = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i
  const matchVimeo = url.match(regExpVimeo)
  if (matchVimeo) {
    videoLink.source = 'vimeo'
    videoLink.id = matchVimeo && matchVimeo[1]
    videoLink.img = defaultImg
    videoLink.mqImg = defaultImg
    videoLink.hqImg = defaultImg
    const getVideoImgs = async () => {
      try {
        const response = await fetch(`https://vimeo.com/api/v2/video/${videoLink.id}.json`)
        videoLink.img = response[0].thumbnail_small
        videoLink.mqImg = response[0].thumbnail_medium
        videoLink.hqImg = response[0].thumbnail_large
      } catch (err) {

      }
    }
    // getVideoImgs()
  }

  // VK link
  const regExpVK = /video([\d]+)_(\d+)/i
  const matchVK = url.match(regExpVK)
  if (matchVK) {
    videoLink.source = 'vk'
    videoLink.oid = matchVK && matchVK[1]
    videoLink.id = matchVK && matchVK[2]
    videoLink.img = defaultImg
    videoLink.mqImg = defaultImg
    videoLink.hqImg = defaultImg
    const getVideoImgs = async () => {
      try {
        const response = await fetch(`https://api.vk.com/method/video.get?videos=-${videoLink.oid}_${videoLink.id}&v=5.124`)
        videoLink.img = response.items[0].image[0]
        videoLink.mqImg = response.items[0].image[2]
        videoLink.hqImg = response.items[0].image[4]
      } catch (err) {

      }
    }
    // getVideoImgs()
  }

  return videoLink
}

export default videoLinkParser
