'use strict';

const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const webpackConfig = require('./webpack-config');

module.exports = function(options) {
    const loaders = webpackConfig.module.loaders.slice();

    loaders.unshift({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'react-hot-loader'
    });

    const entry = {};

    for (let e of options.entries) {
        entry[e] = [ './' + e, 'webpack-hot-middleware/client' ];
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
