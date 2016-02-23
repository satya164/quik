'use strict';

const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack-loaders');

const CURRENTDIR = path.join(__dirname, '..');

module.exports = {
    devtool: 'inline-source-map',
    plugins: [
        new webpack.NoErrorsPlugin(),
    ],
    module: {
        loaders,
    },
    resolveLoader: {
        modules: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    },
    resolve: {
        extensions: [ '', '.web.js', '.js', '.coffee', '.cjsx' ],
        modules: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    },
};
