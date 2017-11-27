import { BrowserPolicy } from 'meteor/browser-policy-common'

// Fonts
BrowserPolicy.content.allowFontOrigin('fonts.googleapis.com')
BrowserPolicy.content.allowFontOrigin('fonts.gstatic.com')
BrowserPolicy.content.allowFontOrigin('data:')

// Scripts
BrowserPolicy.content.allowScriptOrigin('*.jsdelivr.net')
// BrowserPolicy.content.allowScriptOrigin('*.stripe.com')

// Images
BrowserPolicy.content.allowImageOrigin('*.unsplash.com')
BrowserPolicy.content.allowImageOrigin('*.pinimg.com')
BrowserPolicy.content.allowImageOrigin('*.userapi.com')
BrowserPolicy.content.allowImageOrigin('*.vk.me')
BrowserPolicy.content.allowImageOrigin('*.vk.com')
BrowserPolicy.content.allowImageOrigin('*.fbcdn.net')
BrowserPolicy.content.allowImageOrigin('*.youtube.com')

// Allow origin all for
BrowserPolicy.content.allowOriginForAll('*.amazonaws.com')
BrowserPolicy.content.allowOriginForAll('*.cloudflare.com')
BrowserPolicy.content.allowOriginForAll('*.facebook.net')
BrowserPolicy.content.allowOriginForAll('*.facebook.com')
BrowserPolicy.content.allowOriginForAll('*.google.com')
BrowserPolicy.content.allowOriginForAll('*.googlesyndication.com')
BrowserPolicy.content.allowOriginForAll('*.google-analytics.com')
BrowserPolicy.content.allowOriginForAll('*.google.ru')
BrowserPolicy.content.allowOriginForAll('*.gstatic.com')
BrowserPolicy.content.allowOriginForAll('*.doubleclick.net')
BrowserPolicy.content.allowOriginForAll('semantic-ui.com')
BrowserPolicy.content.allowOriginForAll('*.yandex.ru')
BrowserPolicy.content.allowOriginForAll('unpkg.com')
BrowserPolicy.content.allowOriginForAll('*.jplayer.org')
BrowserPolicy.content.allowOriginForAll('*.driftt.com')
BrowserPolicy.content.allowOriginForAll('*.welyx.com')

// Blob URLS (camera)
BrowserPolicy.content.allowOriginForAll('blob:')
// BrowserPolicy.content.allowImageOrigin('blob:');
// const constructedCsp = BrowserPolicy.content._constructCsp();
// BrowserPolicy.content.setPolicy(constructedCsp + ' media-src blob:;');

BrowserPolicy.content.allowEval()
BrowserPolicy.content.allowDataUrlForAll()
BrowserPolicy.content.allowSameOriginForAll()
