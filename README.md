Quik
====
A quick way to prototype apps with React and Babel.

Setting up the tooling required to work on a modern day web app is hard, and makes quick prototyping much more difficult than it should be. Quik is a quick way to prototype a React application without any kind of setup.

## Installation and usage

First, install the npm package globally.

```sh
npm install -g quik
```

Now open the Terminal in any directory and run `quik`. It'll start a simple server which will serve the files in the directory. The awesome thing here is that you can include any ES2015 file in a script tag in an HTML file. The script will be transpiled to ES2015 on the fly. You can use ES2015 modules too!

You can run `quik init AwesomeProject` to generate a sample project with an HTML file and a script for your convenience. This is completely optional.
