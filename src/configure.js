'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const loadWebpackConfig = require('./load-webpack-config');
const existsFileAsync = require('./exists-file-async');

module.exports = function(options) {
    const WORKINGDIR = options.root;
    const OUTPUTFILE = options.output || '[name].bundle.js';

    const config = loadWebpackConfig({
        root: WORKINGDIR
    });

    return Promise.all(
        options.entry.map(
            f => existsFileAsync(fs, path.join(WORKINGDIR, f))
        )
    )
    .then(files => {
        const entry = {};

        for (let f of files) {
            entry[path.basename(f, '.js')] = f;
        }

        return webpack(Object.assign({}, config, {
            entry,
            devtool: 'source-map',
            plugins: options.production ? [
                ...config.plugins,
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.optimize.OccurenceOrderPlugin()
            ] : config.plugins,
            output: {
                path: WORKINGDIR,
                filename: OUTPUTFILE,
                sourceMapFilename: OUTPUTFILE + '.map'
            }
        }));
    });
};
