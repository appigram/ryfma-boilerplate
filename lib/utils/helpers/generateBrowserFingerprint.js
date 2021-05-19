const generateBrowserFingerprint = (isMobile = false, isTablet = false) => {
  const navigatorUserAgent = (navigator.userAgent || navigator.vendor || window.opera)
  const userAgent = navigatorUserAgent.toLowerCase()
  let os = 'Other'
  let browser = 'Other'
  let mode = 'Desktop'

  // We extract the OS from the user agent (respect the order of the if else if statement)
  if (userAgent.indexOf('windows phone') >= 0) {
    os = 'Windows Phone'
  } else if (userAgent.indexOf('win') >= 0) {
    os = 'Windows'
  } else if (userAgent.indexOf('android') >= 0) {
    os = 'Android'
  } else if (userAgent.indexOf('linux') >= 0 || userAgent.indexOf('cros') >= 0) {
    os = 'Linux'
  } else if (userAgent.indexOf('iphone') >= 0 || userAgent.indexOf('ipad') >= 0) {
    os = 'iOS'
  } else if (userAgent.indexOf('mac') >= 0) {
    os = 'Mac'
  }

  // we extract the browser from the user agent (respect the order of the tests)
  if (userAgent.indexOf('firefox') >= 0) {
    browser = 'Firefox'
  } else if (userAgent.indexOf('opera') >= 0 || userAgent.indexOf('opr') >= 0) {
    browser = 'Opera'
  } else if (userAgent.indexOf('chrome') >= 0) {
    browser = 'Chrome'
  } else if (userAgent.indexOf('safari') >= 0) {
    browser = 'Safari'
  } else if (userAgent.indexOf('trident') >= 0) {
    browser = 'Internet Explorer'
  }

  if (isMobile) {
    mode = 'Mobile'
  } else if (isTablet) {
    mode = 'Tablet'
  }

  return os + browser + mode
}

export default generateBrowserFingerprint
