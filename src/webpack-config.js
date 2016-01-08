'use strict';

const webpack = require('webpack');
const path = require('path');

const CURRENTDIR = path.join(__dirname, '..');

module.exports = {
    devtool: 'inline-source-map',
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        require.resolve('babel-preset-es2015'),
                        require.resolve('babel-preset-react'),
                        require.resolve('babel-preset-stage-1')
                    ]
                }
            },
            {
                test: /\.cjsx$/,
                loaders: [ 'babel-loader', 'coffee-loader', 'cjsx-loader' ]
            },
            {
                test: /\.coffee$/,
                loaders: [ 'babel-loader', 'coffee-loader' ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ],
        postLoaders: [
            {
                exclude: /node_modules/,
                loader: 'npm-install-loader',
                test: /\.js$/,
            },
        ]
    },
    resolveLoader: {
        root: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    },
    resolve: {
        extensions: [ '', '.webpack.js', '.web.js', '.js', '.coffee', '.cjsx' ],
        fallback: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    }
};
