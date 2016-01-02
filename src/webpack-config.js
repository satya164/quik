'use strict';

const webpack = require('webpack');
const path = require('path');

const CURRENTDIR = path.join(__dirname, '..');

module.exports = {
    devtool: 'inline-source-map',
    plugins: [
        new webpack.EnvironmentPlugin('NODE_ENV'),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
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
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    resolveLoader: {
        root: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    },
    resolve: {
        fallback: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    }
};
