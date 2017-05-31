# kendo-webpack-systemjs
Basic boilerplate for using KendoUI Pro NPM packages with ES6 modules, using Webpack 2 as the module loader and Babel to transpile to ES5.

In this way, only the parts of Kendo that you're actually using will be included in your final code, which may result in a huge file size reduction in your final code.  Yes, you can always create a custom version of Kendo by hand, but do you really want to keep having to so that every time you add a new Kendo feature?  That's assuming that you even remember to do it, of course!

Please note: the version of the Kendo packages that you download from NPM is now completely different to the one that you download manually from the Progress web site.  The NPM packages cannot be loaded up via a standard browser `<script>` tags.  The is no usable kendo.all.min.js here included that you can use for that purpose.  You _must_ use a module loader of some kind.


## Environment
The code in this repository uses Node/npm to install its dependencies.  Setup instructions are:

1. Install [Node/npm](https://nodejs.org/en/download/) if you don't have it already.  For Windows, you'll also need a bash shell, which you get if you install [Github for Windows] (https://desktop.github.com/) (make sure you tick the box to install the shell).
1. In a bash window, `git clone` this repository.
1. Follow the Progress (formerly Telerik) [instructions for enabling the Progress NPM registry on your machine](http://docs.telerik.com/kendo-ui/intro/installation/npm#kendo-ui-professional).  If it asks for your a Username, you can put in anything: Progress doesn't use that to authenticate.  You will then be prompted for your Progress/Telerik password and email address, in that order, which are the important ones.  You should only need to carry out this step once; your login details are cached thereafter.  You don't need to install the kendo-ui packages manually, because that will be handled by the next step.
1. cd to the repository folder, then issue `npm install` to download the dependencies.  This should include the kendo-ui packages if you entered your authentication details correctly in the previous step.


## Development
To run the Webpack development version, issue `npm run start` at your console to initiate the webpack-dev-server.  Then point your browser to http://localhost:8080/src/index.html.


## Build
To build a standalone(ish) version using Webpack, issue `npm run build` at your console.  This will build everything you need to the /build folder.  All HTML, CSS and JS files will be copied into here.  The JS will be minified, and the correct references will be inserted for the `<script>` tags.

The build process, which makes uses of the Gulp task runner, as well as Webpack, will run tasks to:

1. Clear out the current contents of the /build folder
1. Copy over necessary HTML, CSS and image files from the /src folder to the /build folder
1. Call Webpack to build the JavaScript files
1. Copy over the new JavaScript files, and remove the development script tags and replace them with ones pointing to the new files.

You'll get two JavaScript files from this build process:

1. index.js, which will include your own code
1. vendor.js, which will include jquery and the parts of KendoUI Pro that you're actually using.

This vendor.js file is the key one.   It is just under 900Kb in size, as opposed to nearly 3 Meg for the kendo.all.min.js file included in the Kendo Professional package that you download manually from the Progress site (paid customers only).  The Webpack part of this build process also creates gzipped versions of these two files, courtesy of the [compression-webpack-plugin](https://www.npmjs.com/package/compression-webpack-plugin).  These two files have a .js.gz extension.  The vendor.js.gz is 260kb in size, compared to the 1.3 Meg for a gzipped kendo.all.min.js.

Simply open the file /build/index.html in a local web server to see this version, using whatever web server you have handy.  I favour [http-server](https://www.npmjs.com/package/http-server) for testing, but I don't include it in this repository.  To install and use it:

1. `npm install -g http-server` to install http-server globally.
1. `http-server -p 8081 --gzip` to start a server on port 8081
1. Point your browser to http://localhost:8081/build/index.html to open the page

That `--gzip` option ensures that http-server serves up the 250kb vendor.js.gz file, instead of the 900kb vendor.js. file.  This gives you a closer idea of what sizes you would see on a production web server.

## Documentation

Documentation is auto-generated by [jsdoc](http://jsdoc.org/).  This package is _not_ included as part of this repository.  You can execute the command `npm install -g jsdoc` to install it yourself, globally.  You just need to comment your code in the way that they explain on their site.  To generate the documentation from those comments, issue `npm run docs` in a terminal.

The generated documentation is in the /docs folder.  Open /docs/index.html in your browser to see it.


## SystemJS Version
I've also include a SystemJS version, mainly for experimental purposes.  Simply open /src/index-systemjs.html in your preferred web server to see this.  There is no build step, but you will need to have installed the NPM dependencies.

SystemsJS loads up the module files on the fly, so there is no build step.  If you refresh the page with your browser's Developer Tools open, set to the Network tab, then you can see actually the files loading...slowly!

The reason why using SystemsJS to load your modules in this way can be a slow process, it because as it loads up each module file, one at a time (unlike Webpack, which combines them into one or two bigger files, ahead of time).  Also, SystemJS as to work out which modules to load, and in which order, which puts an extra computational load on the browser - one which Webpack will have done ahead of time.  You may not notice SystemJS's limitations too much on a small, test project like this one, but I've found it to be slow enough to make it unusable for bigger projects.  In short: don't use SystemJS for production.

