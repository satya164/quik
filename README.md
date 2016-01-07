Quik
====
A quick way to prototype apps with React and Babel with zero-setup.

[![Build status](https://travis-ci.org/satya164/quik.svg?branch=master)](https://travis-ci.org/satya164/quik)
[![Dependencies](https://david-dm.org/satya164/quik.svg)](https://david-dm.org/satya164/quik)
[![License](https://img.shields.io/npm/l/quik.svg)](http://opensource.org/licenses/mit-license.php)

Setting up the tooling required to work on a modern day web app is hard, and makes quick prototyping much more difficult than it should be. Quik is a quick way to prototype a React application without any kind of setup.

Quik runs a simple server that compiles JavaScript files with Babel on the fly, so you can include ES2015 files in a script tag directly. It can also generate a JavaScript bundle to use in your app. No setup required.

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

It'll start a simple server which will serve the files in the current directory.

If you want to use a different port. For example, to run the server in the port `8008`, run,

```sh
quik --port 8008
```

You can include any ES2015 file in a script tag in an HTML file and the script will be transpiled to ES2015 on the fly. You can use JSX and Flow syntax as well as use ES2015 modules to import other scripts. It just works.

You can also `import` the following packages by default without any `npm install`,

* [`radium`](http://stack.formidable.com/radium/)
* [`react`](https://facebook.github.io/react/)
* [`react-dom`](https://facebook.github.io/react/docs/top-level-api.html#reactdom)
* [`react-redux`](http://rackt.org/redux/docs/basics/UsageWithReact.html)
* [`react-router`](https://github.com/rackt/react-router)
* [`redux`](http://redux.js.org/)
* [`redux-simple-router`](https://github.com/rackt/redux-simple-router)

In addition to the above modules, `quik` also includes [`npm-install-loader`](https://github.com/ericclemmons/npm-install-loader) which will automatically install missing NPM dependencies during the webpack build. The newly installed module will only be available during the next build/reload.

Note that the versions of libraries included by default might be updated to a newer version with breaking changes. It's okay while prototyping. But if you wan to bundle for production, then it's recommended to add a `package.json` for your project and specify your dependencies there.

## Enabling Hot Module Replacement

To enable Hot Module Replacement for React Components, you need to specify the filenames you want to watch,

```sh
quik --watch file1.js file2.js
```

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
quik --bundle file1.js file2.js --output [name].bundle.js
```

Sourcemap files are automatically generated when generating bundles.

## Generating a sharable single HTML file

Sometimes you might want compile and inject bundles into an HTML file for easier sharing through dropbox, email etc. To do so, run the following in a Terminal,

```sh
quik --html index.html --output output.html --production
```

`quik` will parse your HTML for any local scripts, then it will build them and inject into the HTML file. Just open the generated HTML file in any browser to preview.

## Sample project

To get started with a sample project, run the following in a Terminal,

```sh
quik --init AwesomeProject
cd AwesomeProject && quik
```

This is just for your convenience and is completely optional.

Refer the [API documentation](API.md) for more to know how to customize and extend the server.

## How it works

The `quik` middleware is just an abstraction on top of `webpack`. It includes a base `webpack` config and generates appropriate config files when needed. For example, when the `quik` server receives a request for a JavaScript file, it generates a `webpack` config on the fly, the file is then transpiled with `webpack`, and the server responds with the generated bundle instead of the original script.

## Motivation

Tooling is the hardest part in JavaScript development, and it's time we do something about it.

The following posts inspired me to work on `quik`,

* [Challenge: Best JavaScript Setup for Quick Prototyping](http://blog.vjeux.com/2015/javascript/challenge-best-javascript-setup-for-quick-prototyping.html) by [**@vjeux**](https://github.com/vjeux)
* [Javascript Fatigue](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4) by [**@ericclemmons**](https://github.com/ericclemmons)

One good thing about `quik` is that it is highly opinionated, which means we don't worry about becoming generic and can focus on making it better at what it does. It doesn't allow additional `babel` transforms, or loaders for `webpack` as of now.

Inline styles are recommended for styling. When combined with a library like `radium`, they provide much more flexibility than CSS. This also means that we don't have to configure yet another build step for your preferred CSS pre-processor.

The goal of `quik` is to improve the tooling around React and Babel projects. While it'll be easy enough to support additional customization, it defeats the whole purpose of being zero-setup. If you need additional configuration, it will be better to go with `webpack` directly. If you think something should be included by default, send a pull request or file a bug report.

Even though `quik` itself doesn't provide additional customization, it's just a `koa` middleware at the core. That means it's composable with other koa middlewares and you can add additional functionality easily.

## Plans for improvements

Below are some ideas on how to improve `quik`. It would be awesome to receive pull requests for these.

* Write some tests for Hot Module Replacement
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
