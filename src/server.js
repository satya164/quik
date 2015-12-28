'use strict';

const koa = require('koa');
const send = require('koa-send');
const webpackMiddleware = require('./webpack-middleware');

const WORKINGDIR = process.cwd();

module.exports = function(port) {
    const app = koa();

    app.use(webpackMiddleware);
    app.use(function *() {
        if (this.method === 'GET') {
            if (!/(\.js)$/.test(this.path)) {
                const file = this.path === '/' ? '/index.html' : this.path;

                yield send(this, file, { root: WORKINGDIR });
            }
        } else {
            this.throw(401);
        }
    });

    app.listen(port);

    console.log(`Server listening on ${port}`);
};
