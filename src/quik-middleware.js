'use strict';

const compose = require('koa-compose');
const hmr = require('./quik-middleware-hmr');
const js = require('./quik-middleware-js');

module.exports = function(options) {
    const middlewares = [];

    middlewares.push(js({
        root: options.root
    }));

    if (options.watch && options.watch.length) {
        middlewares.push(hmr({
            root: options.root,
            entry: options.watch
        }));
    }

    return compose(middlewares);
};
