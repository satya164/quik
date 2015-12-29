'use strict';

const koa = require('koa');
const send = require('koa-send');
const logger = require('koa-logger');
const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const quikMiddleWare = require('./quik-middleware');
const webpackConfig = require('./webpack-config');

const WORKINGDIR = process.cwd();

module.exports = function(port, entry) {
    const app = koa();

    app.use(logger());

    if (entry) {
        const compiler = webpack(Object.assign({}, webpackConfig, {
            entry: [
                './' + entry,
                'webpack-hot-middleware/client'
            ],
            output: {
                path: WORKINGDIR,
                publicPath: '/',
                filename: entry
            },
            plugins: [].concat(webpackConfig.plugins, [ new webpack.HotModuleReplacementPlugin() ]),
            loaders: webpackConfig.loaders.slice().unshift({
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    'react-hot-loader'
                ]
            })
        }));

        app.use(webpackDevMiddleware(compiler, {
            publicPath: '/',
            noInfo: true
        }));

        app.use(webpackHotMiddleware(compiler));
    }

    app.use(quikMiddleWare());

    app.use(function *(next) {
        if (typeof this.body === 'undefined') {
            const file = this.path === '/' ? '/index.html' : this.path;

            yield send(this, file, { root: WORKINGDIR });
        }

        yield next;
    });

    app.listen(port);

    console.log(`Server listening on ${port}`);
};
