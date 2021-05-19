Boilerplate for Ryfma website
===================

A starter project for React &amp; Meteor 2.1+ &amp; Apollo

This repo aims to get you up and running. It has sane defaults that most apps will use (router, accounts).

Most of the content is in the 'imports' folder so that we can so serverside rendering more easily.

Install Node.js/Npm (MacOS/Linux)
=============
```
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

Using Homebrew
```
brew install node
```

Install Meteor (MacOS/Linux)
=============
```
curl https://install.meteor.com/ | sh
```

Start the app
=============

```
git clone https://github.com/appigram/ryfma-boilerplate your-project-name
cd your-project-name
meteor npm install
./start
```

Architecture
============

Based on: https://guide.meteor.com/structure.html

```
client
├── stylesheets // All SCSS styles
├── main.js // Client main file
└── service-worker.js // Basic script for Service Worker
imports
├── graphqls // Graphql's mutations and queries
├── hooks // Global hooks (Settings, Auth)
├── shared // Common shared libs
└── ui // All React components
lib // Shared libs for both client and server
packages // Meteor specific packages
private // Email templates and data
public
├── critical // Critical CSS for pages
├── data // Initial data
└── locales // Locales for languages
    └── index.js // Load everything for the server, when meteor is started
server
├── api/apollo // Apollo quieries and mutations
│   ├── resolvers // Apollo resolvers
│   └── schema // Apollo resolvers
│       ├── index.js // Apollo initialization
├── api/collections
│   ├── {collectionName}
│   ├── index.js // linking information
│   └── Schema.js // schema for the collection
├── config // Server config files
├── jobs // Cron jobs
├── seo // SEO methods (Turbo and Sitemap)
├── ssr // SSR methods
└── main.js // Server main file

```

Have fun!


Deploy to DigitalOcean
=============

Prepare server (Digital Ocean’s droplet).
=============
Install git on your server (while signed into root@dropletName:~#):
```
apt-get install git
```
Clone LetsEncrypt:
```
git clone https://github.com/letsencrypt/letsencrypt
cd letsencrypt
./letsencrypt-auto certonly --standalone --email xxx@ryfma.com -d ryfma.com
```
Make sure that your domain has an A record pointing to the right IP address.
Navigate to: ```etc/letsencrypt/live/ryfma.com``` folder.

There will be 4 files. Save these 4 files somewhere safe. If you forget the terminal commands for copying a remote file to the local folder, use Filezilla to access your droplet on Digital Ocean (IP address:xxx.xxx.xxx.xxx, username:root, password, port: 22).
You will need the following 2 files: ```fullchain.pem``` and ```privkey.pem```.
Place these 2 files into your Meteor app’s folder.

Now it’s time to prepare your Meteor app. Install MUPx tool:
Go to the Meteor app folder and run:
```
npm install -g mup
mup init
```
This will create a mup.json file in your app’s folder.
Use your droplet’s information and the above 2 pem files to fill out the content of the mup.json file.
In your terminal, while inside the app folder,
run: ```mup setup``` You will get an error: ```Installing Docker: FAILED```

You gotta go back to your droplet (ssh root@xxx.xxx.xxx.xxx) and install Docker:
```
wget -qO- https://get.docker.com/ | sudo sh
```

Go back to your local app folder, run again:
```
mup setup
meteor add force-ssl
mup deploy
```
Enjoy!

Optional. Deploy your app on a multi-core droplet.
============
I deployed my droplet on 2 CPUs ($20/mo, I wish it’s cheaper, gotta learn AWS at some point). So the next few steps will allow my app to actually use those 2 CPUs.
In your local app folder, run again:
```
meteor add meteorhacks:cluster
export CLUSTER_WORKERS_COUNT=2
mup setup and mup deploy
```
