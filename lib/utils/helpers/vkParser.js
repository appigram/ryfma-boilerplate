const vkParser = (url) => {
  const params = url.replace('https://vk.com/video-', '').split('_')
  return `//vk.com/video_ext.php?oid=-${params[0]}&id=${params[1]}&hd=2`
}

export default vkParser
