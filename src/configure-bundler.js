'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./webpack-config');
const configure = require('./configure-webpack');
const existsFileAsync = require('./exists-file-async');

module.exports = function(options) {
    const WORKINGDIR = options.root;
    const OUTPUTFILE = options.output || '[name].bundle.js';

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

        return configure(config, {
            context: WORKINGDIR,
            devtool: options.devtool,
            production: options.production,
            output: {
                path: WORKINGDIR,
                filename: OUTPUTFILE,
                sourceMapFilename: OUTPUTFILE + '.map'
            },
            entry,
        });
    });
};
