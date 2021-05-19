import isMobile from 'ismobilejs'

export const detectMobile = (userAgent) => {
  const headerUserAgent = typeof window === 'undefined' ? userAgent : (navigator.userAgent || navigator.vendor || window.opera)
  // const isMobileWidth = typeof window !== 'undefined' ? window.innerWidth < 600 : false
  if (headerUserAgent) {
    return isMobile(headerUserAgent).phone // || isMobileWidth
  }
  return false
}

export const detectTablet = (userAgent) => {
  const headerUserAgent = typeof window === 'undefined' ? userAgent : (navigator.userAgent || navigator.vendor || window.opera)
  // const isTabletWidth = typeof window !== 'undefined' ? window.innerWidth < 1024 && window.innerWidth > 600 : false
  if (headerUserAgent) {
    return isMobile(headerUserAgent).tablet // || isTabletWidth
  }
  return false
}

export const detectBot = (userAgent) => {
  const headerUserAgent = typeof window === 'undefined' ? userAgent : (navigator.userAgent || navigator.vendor || window.opera)
  if (headerUserAgent) {
    return /bot|googlebot|crawler|spider|robot|crawling|chrome-lighthouse|/i.test(headerUserAgent)
  }
  return false
}
