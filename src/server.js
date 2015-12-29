'use strict';

const koa = require('koa');
const send = require('koa-send');
const logger = require('koa-logger');
const quikMiddleWare = require('./quik-middleware');
const setupHot = require('./setup-hot');

const DEFAULT_PORT = 3030;

module.exports = function(options) {
    const app = koa();

    app.use(logger());

    if (options.watch && options.watch.length) {
        setupHot({
            app,
            root: options.root,
            entries: options.watch
        });
    }

    app.use(quikMiddleWare({
        root: options.root
    }));

    app.use(function *(next) {
        if (this.method === 'GET') {
            if (typeof this.body === 'undefined') {
                const file = this.path === '/' ? '/index.html' : this.path;

                yield send(this, file, { root: options.root });
            }
        } else {
            this.throw(401);
        }

        yield next;
    });

    const port = options.port || DEFAULT_PORT;

    app.listen(port);

    return Promise.resolve(`http://localhost:${port}`);
};
