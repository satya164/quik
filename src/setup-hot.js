'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const webpackConfig = require('./webpack-config');

module.exports = function(options) {
    const loaders = webpackConfig.module.loaders.slice();

    for (let loader of loaders) {
        if (loader.loader === 'babel-loader' || loader.loader === 'babel') {
            loader.query.presets.push(require.resolve('babel-preset-react-hmre'));
        }
    }

    const entry = {};

    for (let e of options.entries) {
        const file = path.join(options.root, e);

        if (fs.existsSync(file)) {
            entry[e] = [ './' + e, 'webpack-hot-middleware/client' ];
        } else {
            throw new Error('File not found: ' + file);
        }
    }

    const compiler = webpack(Object.assign({}, webpackConfig, {
        entry,
        output: {
            path: options.root,
            publicPath: '/',
            filename: '[name]'
        },
        plugins: [].concat(webpackConfig.plugins, [ new webpack.HotModuleReplacementPlugin() ]),
        module: { loaders }
    }));

    options.app.use(webpackDevMiddleware(compiler, {
        publicPath: '/',
        noInfo: true
    }));

    options.app.use(webpackHotMiddleware(compiler));
};
