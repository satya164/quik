'use strict';

const autoprefixer = require('autoprefixer');
const babelrc = require('./babelrc');

const BABEL_LOADER = 'babel-loader?' + JSON.stringify(babelrc);
const STYLE_LOADERS = [
    'style-loader',
    'css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]',
    'postcss-loader'
];
const POSTCSS_OPTIONS = [ autoprefixer({ browsers: [ 'last 2 versions' ] }) ];

module.exports = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: BABEL_LOADER,
    },
    {
        test: /\.(cjsx|coffee)$/,
        loaders: [ BABEL_LOADER, 'coffee-loader', 'cjsx-loader' ],
    },
    {
        test: /\.json$/,
        loader: 'json-loader',
    },
    {
        test: /\.css$/,
        loaders: STYLE_LOADERS,
        postcss: POSTCSS_OPTIONS,
    },
    {
        test: /\.less$/,
        loaders: [
            ...STYLE_LOADERS,
            'less-loader?outputStyle=expanded&sourceMap'
        ],
        postcss: POSTCSS_OPTIONS,
    },
    {
        test: /\.scss$/,
        loaders: [
            ...STYLE_LOADERS,
            'sass-loader?outputStyle=expanded&sourceMap'
        ],
        postcss: POSTCSS_OPTIONS,
    },
];
