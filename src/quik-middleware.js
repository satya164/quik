'use strict';

const path = require('path');
const MemoryFS = require('memory-fs');
const configure = require('./configure');

module.exports = function(options) {
    const WORKINGDIR = options.root;

    return function *(next) {
        if (typeof this.body === 'undefined' && /(\.js)$/.test(this.path)) {
            const OUTPUTFILE = 'output.js';

            this.body = yield configure({
                root: options.root,
                entry: [ path.join('.', this.path) ],
                output: OUTPUTFILE,
                production: false
            }).then(compiler => {
                return new Promise((resolve, reject) => {
                    const memeoryFs = new MemoryFS();

                    compiler.outputFileSystem = memeoryFs;

                    compiler.run((err, status) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const result = status.toJson();

                        if (result.errors.length) {
                            reject(result.errors);
                            return;
                        }

                        memeoryFs.readFile(path.join(WORKINGDIR, OUTPUTFILE), (error, content) => {
                            if (error) {
                                reject(error);
                                return;
                            }

                            resolve(content.toString());
                        });
                    });
                });
            });
        }

        yield next;
    };
};
