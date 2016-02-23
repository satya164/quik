'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = (config, options) => webpack(Object.assign({}, config, {
    context: options.context,
    entry: options.entry,
    output: options.output,
    devtool: options.devtool || config.devtool,
    plugins: [
        ...config.plugins,
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: options.production ? '"production"' : '"developement"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: !!options.production,
            debug: !options.production
        }),
    ]
    .concat(options.production ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
    ] : [])
    .concat(options.plugins || []),
    resolveLoader: Object.assign({}, config.resolve, {
        modules: [
            config.resolve.modules,
            path.resolve(options.context, 'node_modules'),
        ],
    }),
    resolve: Object.assign({}, config.resolve, {
        modules: [
            config.resolve.modules,
            path.resolve(options.context, 'node_modules'),
        ],
    })
}));
