'use strict';

const koa = require('koa');
const logger = require('koa-logger');
const quik = require('./quik-middleware');

module.exports = function(options) {
    const app = koa();

    app.use(logger());
    app.use(quik(options));

    app.listen(options.port);

    return Promise.resolve(`http://localhost:${options.port}`);
};
