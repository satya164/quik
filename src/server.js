'use strict';

const koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');
const quik = require('./quik-middleware');

module.exports = function(options) {
    const app = koa();

    app.use(logger());
    app.use(quik(options));
    app.use(serve(options.root, { defer: true }));

    return app;
};
