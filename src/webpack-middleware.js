'use strict';

const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const config = require('./webpack-config');

const WORKINGDIR = process.cwd();

module.exports = function() {
    return function *(next) {
        if (/(\.js)$/.test(this.path)) {
            this.body = yield new Promise((resolve, reject) => {
                const fs = new MemoryFS();
                const filePath = this.path;

                const compiler = webpack(Object.assign({}, config, {
                    entry: [ '.' + filePath ],
                    output: {
                        path: WORKINGDIR,
                        filename: 'output.js'
                    }
                }));

                compiler.outputFileSystem = fs;

                compiler.run((err, status) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (status.compilation.errors.length) {
                        reject(status.compilation.errors[0]);
                        return;
                    }

                    fs.readFile(WORKINGDIR + '/output.js', (error, content) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(content.toString());
                    });
                });
            });
        }

        yield next;
    };
};
