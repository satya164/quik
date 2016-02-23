'use strict';

const babelrc = require('./babelrc');

module.exports = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?' + JSON.stringify(babelrc),
    },
    {
        test: /\.json$/,
        loader: 'json-loader',
    },
];
