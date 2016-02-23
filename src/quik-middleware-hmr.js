'use strict';

const expand = require('glob-expand');
const compose = require('koa-compose');
const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const config = require('./webpack-config');
const configure = require('./configure-webpack');
const babelrc = require('./babelrc');

module.exports = function(options) {
    const WORKINGDIR = options.root;

    const BABEL_LOADER = 'babel-loader?' + JSON.stringify(Object.assign({}, babelrc, {
        presets: [
            ...babelrc.presets,
            require.resolve('babel-preset-react-hmre')
        ]
    }));

    const loaders = config.module.loaders.slice();

    for (let loader of loaders) {
        if (loader.loader && loader.loader.indexOf('babel') > -1) {
            loader.loader = BABEL_LOADER;
        } else if (loader.loaders) {
            for (let i = 0, l = loader.loaders.length; i < l; i++) {
                if (loader.loaders[i].indexOf('babel') > -1) {
                    loader.loaders[i] = BABEL_LOADER;
                    break;
                }
            }
        }
    }

    const expanded = expand({ cwd: WORKINGDIR }, options.entry);
    const entry = {};

    for (let e of expanded) {
        entry[e] = [ './' + e, 'webpack-hot-middleware/client' ];
    }

    const compiler = configure(Object.assign({}, config, {
        module: Object.assign({}, config.modules, {
            loaders,
        })
    }), {
        entry,
        plugins: [ new webpack.HotModuleReplacementPlugin() ],
        context: WORKINGDIR,
        output: {
            path: WORKINGDIR,
            publicPath: '/',
            filename: '[name]'
        },
    });

    return compose([
        webpackDevMiddleware(compiler, {
            publicPath: '/',
            noInfo: true
        }),
        webpackHotMiddleware(compiler)
    ]);
};
