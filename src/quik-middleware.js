'use strict';

const fs = require('fs');
const compose = require('koa-compose');
const hmr = require('./quik-middleware-hmr');
const js = require('./quik-middleware-js');
const run = require('./quik-middleware-run');

module.exports = function(options) {
    const middlewares = [];

    middlewares.push(js({
        root: options.root
    }));

    let script, watch;

    if (options.run || options.watch) {
        script = options.run;
        watch = options.watch;
    } else {
        const index = 'index.js';

        try {
            fs.accessSync(index, fs.R_OK);
            watch = [ index ];
        } catch (e) {
            // Do nothing
        }

        try {
            fs.accessSync('index.html', fs.R_OK);
        } catch (e) {
            script = index;
        }
    }

    if (script) {
        middlewares.push(run({
            root: options.root,
            script
        }));
    }

    if (watch && watch.length) {
        middlewares.push(hmr({
            root: options.root,
            entry: watch
        }));
    }

    return compose(middlewares);
};
