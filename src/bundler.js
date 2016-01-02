'use strict';

const fs = require('fs');
const webpack = require('webpack');
const config = require('./webpack-config');

module.exports = function(options) {
    return new Promise((resolve, reject) => {
        const WORKINGDIR = options.root;
        const OUTPUTFILE = options.output || '[name].bundle.js';

        const entry = {};

        for (let e of options.entry) {
            if (fs.existsSync(WORKINGDIR + '/' + e)) {
                entry[e.replace(/\.js$/, '')] = './' + e;
            } else {
                throw new Error('File not found: ' + WORKINGDIR + '/' + e);
            }
        }

        const compiler = webpack(Object.assign({}, config, {
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

        compiler.run((err, status) => {
            if (err) {
                reject(err);
                return;
            }

            console.log(status.toString({
                colors: true
            }));

            const result = status.toJson();

            if (result.errors.length) {
                reject(result.errors);
                return;
            }

            resolve(result);
        });
    });
};
