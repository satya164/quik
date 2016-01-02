'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const loadWebpackConfig = require('./load-webpack-config');

module.exports = function(options) {
    const config = loadWebpackConfig({
        root: options.root
    });
    const loaders = config.module.loaders.slice();

    for (let i = 0, l = loaders.length; i < l; i++) {
        const loader = loaders[i];

        if (loader.loader === 'babel-loader' || loader.loader === 'babel') {
            loaders[i] = Object.assign({}, loader, {
                query: Object.assign({}, loader.query, {
                    presets: [
                        ...loader.query.presets,
                        require.resolve('babel-preset-react-hmre')
                    ]
                })
            });
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

    const compiler = webpack(Object.assign({}, config, {
        entry,
        output: {
            path: options.root,
            publicPath: '/',
            filename: '[name]'
        },
        plugins: [].concat(config.plugins, [ new webpack.HotModuleReplacementPlugin() ]),
        module: { loaders }
    }));

    options.app.use(webpackDevMiddleware(compiler, {
        publicPath: '/',
        noInfo: true
    }));

    options.app.use(webpackHotMiddleware(compiler));
};
