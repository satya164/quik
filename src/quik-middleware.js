'use strict';

const compose = require('koa-compose');
const serve = require('koa-static');
const hmr = require('./quik-middleware-hmr');
const js = require('./quik-middleware-js');

module.exports = function(options) {
    const middlewares = [];

    middlewares.push(serve(options.root));

    if (options.watch && options.watch.length) {
        middlewares.push(hmr({
            root: options.root,
            entries: options.watch
        }));
    }

    middlewares.push(js({
        root: options.root
    }));

    return compose(middlewares);
};
