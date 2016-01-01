'use strict';

const webpack = require('webpack');
const config = require('./webpack-config');

module.exports = function(options) {
    return new Promise((resolve, reject) => {
        const WORKINGDIR = options.root;
        const ENTRYFILES = options.entry;
        const OUTPUTFILE = options.output;
        const PRODUCTION = options.production;

        const output = {
            path: WORKINGDIR,
            filename: OUTPUTFILE
        };

        if (OUTPUTFILE) {
            output.sourceMapFilename = OUTPUTFILE + '.map';
        }

        const compiler = webpack(Object.assign({}, config, {
            devtool: 'source-map',
            entry: ENTRYFILES,
            plugins: PRODUCTION ? [
                ...config.plugins,
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.optimize.OccurenceOrderPlugin()
            ] : config.plugins,
            output
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
                reject(result.errors[0]);
                return;
            }

            resolve(WORKINGDIR + '/' + result.assetsByChunkName.main[0]);
        });
    });
};
