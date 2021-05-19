Meteor-CDN
===========

Serve static content from a CDN like CloudFlare or CloudFront. This package changes the domain of the bundled css and js files to the environment variable CDN_URL. If the CDN_URL environment variable is not present, the default behaviour will be unchanged.

Installation
===============
```sh
meteor add nitrolabs:cdn
```

Setup CloudFront or CloudFlare to proxy requests to your Meteor server. Then run Meteor with:
```sh
export CDN_URL="http://mydomain.cloudfront.com" && meteor
```

Features
========

### Meteor resources are Loaded from your CDN
CDN automatically sets WebAppInternals.setBundledJsCssPrefix to match CDN_URL so the main Meteor css and js files are loaded from your CDN.

### Template helper for other static files
CDN also provides a template helper to get the CDN_URL in your templates.
The CDN_URL helper can not be used in the head block, because Meteor does
evaluate helpers in the head block.

```html
<template name="MasterLayout">
	<img src="{{CDN_URL}}/images/profile.jpg"></img>
</template>
```

### Getting CDN url in Javascript
CDN exposes function which can be used to get current CDN address.

```javascript
CDN.get_cdn_url()
```
### Modifying headers to allow caching of public files
By default all files in Meteor public folder have `cache-content: public, max-age: 0` header set, which directs the browser / CDN to cache the files for 0 seconds and means that the files are **always** served from the original server and never cached. By setting `CDN.config.headers` you have the ability to set custom headers for files / folders in the public folder to make files in public folder being cached. Path used in `CDN.config.header` can be full path to file or folder which under the files are in.

Below is an example on setting up caching for public folder. Add the configuration to your server, preferably inside your `Meteor.startup` function:

```javascript
// Best to only setup caching on production so things do not get cached on development
if (Meteor.isProduction) {
    CDN.config({
        headers: {
            // Files in this example folder change very infrequently
            "/someicons/": { "cache-control": "public, max-age: 10000" },
            // We can set smaller caching times for individual files
            "/someicons/changingIcon.png": { "cache-control": "public, max-age: 100" },
            // This folder contains subfolders and files under them
            "/staticassets/": { "cache-control": "public, max-age: 5000" },
        };
    });
}
```

To verify that the headers we're being set correctly for your assets, you can:
- Open **Chrome Developer Tools**
- Open **Network** tab
- Make sure the topleft recording balloon is set to record
- Refresh page
- Select assets you set the headers for and verify that the **Response Headers** section shows correct headers (remember to remove the production check if trying to check the headers on development environment).

### Webfont headers
Google Chrome and several other mainstream browsers prevent webfonts being loaded from via CORS, unless the [Strict-Transport-Security  header](https://developer.mozilla.org/en-US/docs/Web/Security/HTTP_strict_transport_security) is set correctly. This package automatically adds the correct CORS and STS headers to webfont files to prevent this issue. When setting up Cloudfront or CloudFlare you should whitelist the Origin and Strict-Transport-Security headers.

### Proper 404 handling (beta)
Meteor currently uses the 200 response code for every request, regardless of whether the route or static resource exists. This can cause the CDN to cache error messages for static resources. `nitrolabs:cdn` fixes this problem by:
* Only allowing static resources to be served at the CDN_URL
* Returning a proper 404 for any missing static resources

Detailed Installation Guide
===========================
nitrolabs:cdn is compatible with most production setups.

### Using MUP
When serving your app with mup the ROOT_URL and CDN_URL environment variables can be set from mup.json. See the [meteor-cdn demo](https://github.com/NitroLabs/meteor-cdn-demo/) on Github for more details.

```js
// mup.json
{
    // Normal mup settings
    // ...
    // Configure environment
    "env": {
        "PORT"                 : 80,
        "CDN_URL"              : "http://d3k17ze63872d4.cloudfront.net",
        "ROOT_URL"             : "http://www.mysite.com"
    }
}
  ```

### Using with Galaxy
CDN works perfectly with MDG Galaxy. Setup instructions:
* Add the `nitrolabs:cdn` package to your app
* Point CloudFront to your meteor server (see setting up CloudFront)
* Set the CDN_URL environment variable to xyz.cloudfront.com

The ROOT_URL and CDN_URL environment variables can be set from settings.json
```javascript
// Settings.json
{
  "galaxy.meteor.com": {
    "env": {
        "ROOT_URL": "https://www.mydomain.com",
        "CDN_URL": "https://xyz.cloudfront.net",
        "MONGO_URL": "...",
        "MONGO_OPLOG_URL": "..."
    }
  }
}
```

### Setting up CloudFront
Settings described in this section should be set to your CloudFront distribution. All settings here are just the settings that need to be changed, you can leave all other settings to default values when creating the distribution.

* **Origin Domain Name**: yourMeteorServer.com (point this to address where your Meteor server is located)
* **Origin Protocol Policy**: Match Viewer
* **Viewer Protocol Policy**: HTTPS Only (Leave this as HTTP and HTTPS if your server does not have SSL enabled)
* **Forward Headers**: Whitelist
* **Whitelist Headers**: Origin, Strict-Transport-Security (Origin can be selected from the list but latter needs to be typed into the textfield and added manually)
* **Query String Forwarding and Caching**: Forward all, cache based on all
* **Compress Objects Automatically**: Yes

Development and Testing
-----------------------
We welcome contributions from the community. We aim to test and merge within 24 hours,
especially for pull requests that fix existing bugs or add relevant functionality.
Please make sure all tests pass before submitting a pull request:
```sh
meteor test-packages ./
```


License
------

MIT
