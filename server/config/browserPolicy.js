import { BrowserPolicy } from 'meteor/browser-policy-common'

// Framing
// BrowserPolicy.framing.disallow()
// BrowserPolicy.framing.restrictToOrigin('https://*.ryfma.com')
// BrowserPolicy.framing.restrictToOrigin('https://*.vk.com')
BrowserPolicy.framing.restrictToOrigin('https://*.webvisor.com')

// Fonts
BrowserPolicy.content.allowFontDataUrl()

// Scripts
// BrowserPolicy.content.allowScriptOrigin('https://*.jsdelivr.net')

// Images
BrowserPolicy.content.allowImageOrigin('*')

// Allow origin all for
BrowserPolicy.content.allowOriginForAll('*')
/* BrowserPolicy.content.allowOriginForAll('https://*.amazonaws.com')
BrowserPolicy.content.allowOriginForAll('https://*.cloudflare.com')
BrowserPolicy.content.allowOriginForAll('*.facebook.net')
BrowserPolicy.content.allowOriginForAll('*.facebook.com')
BrowserPolicy.content.allowOriginForAll('*.doubleclick.net')
BrowserPolicy.content.allowOriginForAll('*.criteo.net')
BrowserPolicy.content.allowOriginForAll('*.googlesyndication.com')
BrowserPolicy.content.allowOriginForAll('*.google-analytics.com')
BrowserPolicy.content.allowOriginForAll('*.googleapis.com')
BrowserPolicy.content.allowOriginForAll('*.gstatic.com')
BrowserPolicy.content.allowOriginForAll('https://*.driftt.com')
BrowserPolicy.content.allowOriginForAll('https://*.drift.com')
BrowserPolicy.content.allowOriginForAll('https://*.ryfma.com')
BrowserPolicy.content.allowOriginForAll('https://*.vk.com')
BrowserPolicy.content.allowOriginForAll('https://*.twitter.com')
BrowserPolicy.content.allowOriginForAll('https://*.youtube.com')
BrowserPolicy.content.allowOriginForAll('https://*.ytimg.com')
BrowserPolicy.content.allowOriginForAll('https://*.wiktionary.org')

// All Google domains
BrowserPolicy.content.allowOriginForAll('*.google.com')
BrowserPolicy.content.allowOriginForAll('*.google.ru')
BrowserPolicy.content.allowOriginForAll('*.google.am')
BrowserPolicy.content.allowOriginForAll('*.google.at')
BrowserPolicy.content.allowOriginForAll('*.google.ba')
BrowserPolicy.content.allowOriginForAll('*.google.be')
BrowserPolicy.content.allowOriginForAll('*.google.bg')
BrowserPolicy.content.allowOriginForAll('*.google.by')
BrowserPolicy.content.allowOriginForAll('*.google.ch')
BrowserPolicy.content.allowOriginForAll('*.google.cz')
BrowserPolicy.content.allowOriginForAll('*.google.de')
BrowserPolicy.content.allowOriginForAll('*.google.dk')
BrowserPolicy.content.allowOriginForAll('*.google.ee')
BrowserPolicy.content.allowOriginForAll('*.google.es')
BrowserPolicy.content.allowOriginForAll('*.google.fi')
BrowserPolicy.content.allowOriginForAll('*.google.fr')
BrowserPolicy.content.allowOriginForAll('*.google.gr')
BrowserPolicy.content.allowOriginForAll('*.google.hu')
BrowserPolicy.content.allowOriginForAll('*.google.ie')
BrowserPolicy.content.allowOriginForAll('*.google.is')
BrowserPolicy.content.allowOriginForAll('*.google.it')
BrowserPolicy.content.allowOriginForAll('*.google.lt')
BrowserPolicy.content.allowOriginForAll('*.google.lv')
BrowserPolicy.content.allowOriginForAll('*.google.md')
BrowserPolicy.content.allowOriginForAll('*.google.mk')
BrowserPolicy.content.allowOriginForAll('*.google.nl')
BrowserPolicy.content.allowOriginForAll('*.google.no')
BrowserPolicy.content.allowOriginForAll('*.google.pl')
BrowserPolicy.content.allowOriginForAll('*.google.pt')
BrowserPolicy.content.allowOriginForAll('*.google.ro')
BrowserPolicy.content.allowOriginForAll('*.google.rs')
BrowserPolicy.content.allowOriginForAll('*.google.se')
BrowserPolicy.content.allowOriginForAll('*.google.si')
BrowserPolicy.content.allowOriginForAll('*.google.sk')
BrowserPolicy.content.allowOriginForAll('*.google.tr')
BrowserPolicy.content.allowOriginForAll('*.google.ua')
BrowserPolicy.content.allowOriginForAll('*.google.uk')
BrowserPolicy.content.allowOriginForAll('*.google.us')
BrowserPolicy.content.allowOriginForAll('*.google.ca') */

// Blob URLS (camera)
BrowserPolicy.content.allowOriginForAll('blob:')
// BrowserPolicy.content.allowImageOrigin('blob:');
// const constructedCsp = BrowserPolicy.content._constructCsp();
// BrowserPolicy.content.setPolicy(constructedCsp + ' media-src blob:;');

BrowserPolicy.content.allowEval()
BrowserPolicy.content.allowDataUrlForAll()
BrowserPolicy.content.allowSameOriginForAll()
