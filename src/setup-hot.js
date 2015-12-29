'use strict';

const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const webpackConfig = require('./webpack-config');

const WORKINGDIR = process.cwd();

module.exports = function(app, entries) {
    const loaders = webpackConfig.module.loaders.slice();

    loaders.unshift({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'react-hot-loader'
    });

    const entry = {};

    for (let e of entries) {
        entry[e] = [ './' + e, 'webpack-hot-middleware/client' ];
    }

    const compiler = webpack(Object.assign({}, webpackConfig, {
        entry,
        output: {
            path: WORKINGDIR,
            publicPath: '/',
            filename: '[name]'
        },
        plugins: [].concat(webpackConfig.plugins, [ new webpack.HotModuleReplacementPlugin() ]),
        module: { loaders }
    }));

    app.use(webpackDevMiddleware(compiler, {
        publicPath: '/',
        noInfo: true
    }));

    app.use(webpackHotMiddleware(compiler));
};
