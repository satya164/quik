'use strict';

const koa = require('koa');
const send = require('koa-send');
const logger = require('koa-logger');
const quikMiddleWare = require('./quik-middleware');
const setupHot = require('./setup-hot');

const WORKINGDIR = process.cwd();

module.exports = function(port, entry) {
    const app = koa();

    app.use(logger());

    if (entry) {
        setupHot(app, entry);
    }

    app.use(quikMiddleWare());

    app.use(function *(next) {
        if (this.method === 'GET') {
            if (typeof this.body === 'undefined') {
                const file = this.path === '/' ? '/index.html' : this.path;

                yield send(this, file, { root: WORKINGDIR });
            }
        } else {
            this.throw(401);
        }

        yield next;
    });

    app.listen(port);

    console.log(`Server listening on ${port}`);
};
