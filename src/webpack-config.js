'use strict';

const webpack = require('webpack');
const path = require('path');
const babelrc = require('./babelrc');

const CURRENTDIR = path.join(__dirname, '..');

const BABEL_LOADER = 'babel-loader?' + JSON.stringify(babelrc);
const STYLE_LOADERS = [
    'style-loader',
    'css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]',
    'autoprefixer-loader?browsers=last 2 version'
];

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
                loader: BABEL_LOADER
            },
            {
                test: /\.(cjsx|coffee)$/,
                loaders: [ BABEL_LOADER, 'coffee-loader', 'cjsx-loader' ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                loaders: STYLE_LOADERS
            },
            {
                test: /\.less$/,
                loaders: [
                    ...STYLE_LOADERS,
                    'less-loader?outputStyle=expanded&sourceMap'
                ]
            },
            {
                test: /\.scss$/,
                loaders: [
                    ...STYLE_LOADERS,
                    'sass-loader?outputStyle=expanded&sourceMap'
                ]
            },
        ],
        postLoaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'npm-install-loader',
                query: {
                    cli: {
                        save: true
                    },
                },
            },
        ],
    },
    resolveLoader: {
        root: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    },
    resolve: {
        extensions: [ '', '.webpack.js', '.web.js', '.js', '.jsx', '.coffee', '.cjsx' ],
        fallback: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    },
};
