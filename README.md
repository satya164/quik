Quik
====
A quick way to prototype and build apps with React and Babel with zero-setup.

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm version](https://badge.fury.io/js/quik.svg)](https://www.npmjs.com/quik)
[![build status](https://travis-ci.org/satya164/quik.svg?branch=master)](https://travis-ci.org/satya164/quik)
[![coverage status](https://coveralls.io/repos/github/satya164/quik/badge.svg?branch=master)](https://coveralls.io/github/satya164/quik?branch=master)
[![dependencies](https://david-dm.org/satya164/quik.svg)](https://david-dm.org/satya164/quik)
[![license](https://img.shields.io/npm/l/quik.svg)](http://opensource.org/licenses/mit-license.php)

Setting up the tooling required to work on a modern day web app is hard, and makes quick prototyping much more difficult than it should be. Quik is a quick way to prototype a React application without any kind of setup. It can also generate a production-ready JavaScript bundle to use in your app. No setup required.

Quik runs a simple server that compiles JavaScript files with Babel on the fly, so you can include ES201x files in a script tag directly,

```html
<script src="index.js"></script>
```

__Tip:__ You can add `?transpile=false` to the script src to skip the transpilation.

Quik also exposes a `koa` middleware which can be easily integrated with your server.

## Features

* One-time installation, no additional setup required
* Hot Module Replacement
* Generates bundles for use in production
* Generates single standalone HTML file for sharing
* React, Redux, React Router and Radium are already included
* Quick prototyping with an optional starter template

## Installation

You need at least Node 5.0 to run `quik`.

```sh
npm install --global quik
```

## Usage

Open the Terminal in any directory and run the following,

```sh
quik
```

It'll start a simple server which will serve the files in the current directory. By default, it'll automatically watch the file `index.js` if present.

If no `index.html` file is present, it'll generate and serve an HTML file with it's script tag pointing to `index.js` file. Alternatively, you can specify the name of the script to include,

```sh
quik --run script.js
```

If you want to use a different port. For example, to run the server in the port `8008`, run,

```sh
quik --port 8008
```

You can include any ES2015 file in a script tag in an HTML file and the script will be transpiled to ES5 on the fly. You can use JSX and Flow syntax as well as use ES2015 modules to import other scripts. It just works.

NOTE: You'll need to install any dependencies you use in the project manually.

## Enabling Hot Module Replacement

Hot Module Replacement for React Components is automatically enabled if you have a script named `index.js` in the directory, or if you specified a script to run with the `--run` option, for example,

```sh
quik --run app.js
```

Alternatively, you can specify the filenames you want to watch for HMR,

```sh
quik --watch file1.js file2.js
```

When using the `--run` option, the `index.html` file is always generated on the fly and served. If you want to use your own `index.html` file, just use `--watch`.

You only need to specify the entry points, not all scripts. Most of the time it'll be just one script. Note that Hot Module Replacement won't work for any components in the entry points.

## Generating JavaScript Bundle

The bundler provides an abstraction on top of webpack with sensible defaults for a React project. If you need additional customisation, use `webpack` directly for bundling.

To generate a bundle wth `quik` for use in your web application, run the following in a Terminal,

```sh
quik --bundle entry.js --output bundle.js --production
```

The `--production` option performs minification on the resulting bundle. You can omit it if you're not going to use the file in production.

You can provide multiple entry points as arguments. In that case, you can use `[name]` to get the name of the entry point while specifying an output file,

```sh
quik --bundle file1.js file2.js --output [name].bundle.js --common common.bundle.js
```

Sourcemap files are automatically generated when generating bundles.

## Generating a sharable single HTML file

Sometimes you might want compile and inject bundles into an HTML file for easier sharing through dropbox, email etc. To do so, run the following in a Terminal,

```sh
quik --html --output output.html --production
```

You can also specify an HTML file, which `quik` will parse for any local scripts. Then it will build them and inject into the HTML file. It'll also inline stylesheets as is, without any pre-processing. Just open the generated HTML file in any browser to preview.

```sh
quik --html index.html --output output.html
```
## Specify browser to open

You can specify which browser to open when server starts. Refer [opn](https://npmjs.com/opn)'s documentation on browser names.

For example, to use firefox as the browser, you'd do,

```sh
quik --browser firefox
```

## Sample project

To get started with a sample project, run the following in a Terminal,

```sh
quik --init AwesomeProject
cd AwesomeProject && quik
```

Refer the [API documentation](API.md) for more to know how to customize and extend the server.

## How it works

The `quik` middleware is just an abstraction on top of `webpack`. It includes a base `webpack` config and generates appropriate config files when needed. For example, when the `quik` server receives a request for a JavaScript file, it generates a `webpack` config on the fly, the file is then transpiled with `webpack`, and the server responds with the generated bundle instead of the original script.

## Motivation

Tooling is the hardest part in JavaScript development, and it's time we do something about it.

The following posts inspired me to work on `quik`,

* [Challenge: Best JavaScript Setup for Quick Prototyping](http://blog.vjeux.com/2015/javascript/challenge-best-javascript-setup-for-quick-prototyping.html) by [**@vjeux**](https://github.com/vjeux)
* [Javascript Fatigue](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4) by [**@ericclemmons**](https://github.com/ericclemmons)

One good thing about `quik` is that it is highly opinionated, which means we don't worry about becoming generic and can focus on making it better at what it does. It doesn't allow additional `babel` transforms, or loaders for `webpack` as of now.

Inline styles are recommended for styling. When combined with a library like `radium`, they provide much more flexibility than CSS.

The goal of `quik` is to improve the tooling around React and Babel projects. While it'll be easy enough to support additional customization, it defeats the whole purpose of being zero-setup. If you need additional configuration, it will be better to go with `webpack` directly. If you think something should be included by default, send a pull request or file a bug report.

Even though `quik` itself doesn't provide additional customization, it's just a `koa` middleware at the core. That means it's composable with other koa middlewares and you can add additional functionality easily.

## Plans for improvements

Below are some ideas on how to improve `quik`. It would be awesome to receive pull requests for these.

* Automatically parse HTML files to enable hot reloading without having to specify files with `--watch`
* Cache bundles instead of re-building on every request
* Better error handling
* Atom plugin to make it easier to use without CLI

## Similar tools

Of course, `quik` is not the only tool trying to solve this problem. There are few other tools which are also doing a great job at it.

* [react-heatpack](https://github.com/insin/react-heatpack) - a very minimal prototyping server for React with Hot Module Replacement
* [nwb](https://github.com/insin/nwb) - similar, but has lot more options
* [rwb](https://github.com/petehunt/rwb) - pretty similar to `quik`, has Hot Module Replacement and can also build bundles for production
* [run-js](https://github.com/remixz/run-js) - works on top of [`browserify`](http://browserify.org/), zero-setup, has live-reload functionality
