const getAverageColor = (canvas, imgSrc) => {
  const img = new Image()
  img.src = imgSrc
  const ctx = canvas.getContext('2d')
  const width = canvas.width = img.naturalWidth
  const height = canvas.height = img.naturalHeight

  ctx.drawImage(img, 0, 0)

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  let r = 0
  let g = 0
  let b = 0

  for (let i = 0, l = data.length; i < l; i += 4) {
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
  }

  r = Math.floor(r / (data.length / 4))
  g = Math.floor(g / (data.length / 4))
  b = Math.floor(b / (data.length / 4))

  const finalColor = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  return finalColor
}

export default getAverageColor
