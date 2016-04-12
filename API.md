## API

You can use various commands of `quik` programmatically through the node module,

```js
const quik = require('quik');
```

To start the `quik` server,

```js
quik.server({
    root: process.cwd(),
    watch: [ 'file1.js', 'file2.js' ]
}).listen(8080);
```

To generate a bundle,

```js
quik.bundle({
    root: process.cwd(),
    entry: [ 'index.js' ],
    output: '[name].bundle.min.js',
    sourcemaps: true,
    production: true
});
```

To generate a sharable HTML file,

```js
quik.html({
    root: process.cwd(),
    entry: 'index.html',
    output: 'index.quik.html',
    sourcemaps: true,
    production: true
});
```

The middleware is at the heart of `quik` and is responsible for transpiling scripts on the fly as well as setting up HMR. You can use the middleware directly in any `koa` server,

```js
const quik = require('quik/middleware');

app.use(quik({
    root: process.cwd(),
    run: 'script.js'
}));
```

This is useful if you want to add functionality on top of what `quik` already provides. For example, if you want to add support for your favourite CSS preprocessor, just write a middleware (or use an existing one) for it and use along with the `quik` middleware. For example, to use [`koa-sass`](https://github.com/kasperlewau/koa-sass) with `quik`,

```js
const quik = require('quik/middleware');
const serve = require('koa-static');
const sass = require('koa-sass');
const koa = require('koa');

const app = koa();

app.use(quik({
    root: process.cwd()
}));

app.use(sass({
    src: process.cwd() + '/src/styles/',
    dest: process.cwd() + '/dist/styles/'
}));

app.use(serve(process.cwd(), {
    defer: true
}));

app.listen(9000);
```
