'use strict';

const compose = require('koa-compose');
const send = require('koa-send');
const hmr = require('./quik-middleware-hmr');
const js = require('./quik-middleware-js');

module.exports = function(options) {
    const middlewares = [];

    if (options.watch && options.watch.length) {
        middlewares.push(hmr({
            root: options.root,
            entries: options.watch
        }));
    }

    middlewares.push(js({
        root: options.root
    }));

    middlewares.push(function *(next) {
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

    return compose(middlewares);
};
