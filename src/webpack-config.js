'use strict';

const webpack = require('webpack');
const path = require('path');

const CURRENTDIR = path.join(__dirname, '..');
const WORKINGDIR = process.cwd();

module.exports = {
    devtool: 'eval',
    plugins: [ new webpack.NoErrorsPlugin() ],
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
        root: [
            path.join(CURRENTDIR, 'node_modules'),
            path.join(WORKINGDIR, 'node_modules')
        ]
    }
};
