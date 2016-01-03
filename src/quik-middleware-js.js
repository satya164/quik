'use strict';

const path = require('path');
const MemoryFS = require('memory-fs');
const readFileAsync = require('./read-file-async');
const formatError = require('./format-error');
const configure = require('./configure');

const CONTENT_TYPE = 'application/javascript';

module.exports = function(options) {
    const WORKINGDIR = options.root;

    const test = file => /(\.js)$/.test(file);

    return function *(next) {
        if (this.method === 'GET' && this.accepts(CONTENT_TYPE) && test(this.path)) {
            const OUTPUTFILE = 'output.js';

            this.type = CONTENT_TYPE;
            this.body = yield configure({
                root: options.root,
                entry: [ path.join('.', this.path) ],
                output: OUTPUTFILE,
                production: false
            })
            .then(compiler => {
                return new Promise((resolve, reject) => {
                    const memoryFs = new MemoryFS();

                    compiler.outputFileSystem = memoryFs;

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

                        resolve(readFileAsync(memoryFs, path.join(WORKINGDIR, OUTPUTFILE)));
                    });
                });
            })
            .catch(formatError);
        }

        yield next;
    };
};
