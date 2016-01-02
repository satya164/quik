Quik
====
A quick way to prototype apps with React and Babel.

Setting up the tooling required to work on a modern day web app is hard, and makes quick prototyping much more difficult than it should be. Quik is a quick way to prototype a React application without any kind of setup.

Quik runs a simple server that compiles JavaScript files with Babel on the fly, so you can include ES2015 files in a script tag directly.

## Features

* One-time installation, no additional setup required
* React, Redux and Radium are already included
* Hot-module replacement
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
* [`redux`](http://redux.js.org/)

## Enabling Hot reload

To enable hot reload for React Components, you need to specify the filenames you want to watch,

```sh
quik --watch file1.js file2.js
```

You only need to specify the entry points, not all scripts. Most of the time, it'll be just one script. Note that hot reload won't work for any components in the entry points.

## Generating JavaScript Bundle

To generate a bundle for use in your web application, run the following in a Terminal,

```sh
quik --bundle entry.js --output bundle.js --production
```

The `--production` option performs minification on the resulting bundle. You can omit it if you're not going to use the file in production.

You can provide multiple entry points as arguments. In that case, you can use `[name]` to get the name of the entry point while specifying an output file.

```sh
quik --bundle file1.js file2.js --output [name].bundle.js
```

A sourcemap file is automatically generated when generating a bundle.

## Sample project

To get started with a sample project, run the following in a Terminal,

```sh
quik --init AwesomeProject
cd AwesomeProject && quik
```

This is just for your convenience and is completely optional.

## API

You can also use `quik` by requiring it as a node module.

```js
const quik = require('quik');

quik.server({
    root: process.cwd(),
    port: 8008,
    watch: [ 'file1.js', 'file2.js' ]
});
```

To generate a bundle programmatically,

```js
const quik = require('quik');

quik.bundle({
    root: process.cwd(),
    entry: [ 'index.js' ],
    output: '[name].bundle.min.js',
    production: true
});
```

The `middleware` is responsible for transpiling scripts on request. You can use the middleware directly in a `koa` server,

```js
const quikMiddleware = require('quik/middleware');

app.use(quikMiddleware({
    root: process.cwd()
}));
```

## How it works

The idea behind `quik` is very simple. Whenever a request for a JavaScript file is received, a `webpack` config is generated for the file on the fly, the file is then transpiled with `webpack`, and the server responds with the generated bundle instead of the original script. The hot module replacement is also powered by `webpack`.

## Motivation

Tooling is the hardest part in JavaScript development, and it's time we do something about it.

The following posts inspired me to work on `quik`,

* [Challenge: Best JavaScript Setup for Quick Prototyping](http://blog.vjeux.com/2015/javascript/challenge-best-javascript-setup-for-quick-prototyping.html) by [@vjeux](https://github.com/vjeux)
* [Javascript Fatigue](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4) by [@ericclemmons](https://github.com/ericclemmons)

One good thing about `quik` is that it is highly opinionated, which means we don't worry about becoming generic and can focus on making it better at what it does. It doesn't allow additional `babel` transforms, or loaders for `webpack`, nor do we plan to in near future.

## Plans for improvements

* Automatically parse HTML files to enable hot reloading without having to specify files with `--watch`
* Cache bundles instead of re-building on every request
* Better error handling
* Build a bundle and inject it to the HTML file for sharing
* Atom plugin to make it easier to use without CLI
