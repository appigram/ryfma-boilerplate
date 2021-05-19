const rgbToHsl = (rSrc, gSrc, bSrc) => {
  const r = rSrc / 255
  const g = gSrc / 255
  const b = bSrc / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h
  let s
  let l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: h, s: s, l: l }
}

export default rgbToHsl
