'use strict';

const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const MemoryFS = require('memory-fs');
const configure = require('./configure');

module.exports = function(options) {
    const result = fs.readFileSync(path.join(options.root, options.entry));

    const $ = cheerio.load(result.toString());

    return Promise.all(
        $('script').map((i, el) => {
            const src = $(el).attr('src');

            if (src && !/^((https?:)?\/\/)/.test(src)) {
                return configure({
                    root: options.root,
                    entry: [ './' + path.relative(options.root, path.join(path.dirname(path.join(options.root, options.entry)), src)) ],
                    output: 'output.js',
                    production: options.production
                })
                .then(compiler => {
                    const memoryFs = new MemoryFS();

                    compiler.outputFileSystem = memoryFs;

                    return new Promise((resolve, reject) => {
                        compiler.run((err, status) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            if (status.compilation.errors.length) {
                                reject(status.compilation.errors[0]);
                                return;
                            }

                            console.log(status.toString({
                                colors: true
                            }));

                            memoryFs.readFile(path.join(options.root, 'output.js'), (error, content) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }

                                resolve(content.toString());
                            });
                        });
                    });
                })
                .then(content => {
                    $(el).attr('src', null);
                    $(el).text(content);
                });
            }
        })
        .get()
    ).then(() => {
        return new Promise((resolve, reject) => {
            const file = path.join(options.root, options.output || path.basename(options.entry, '.html') + '.quik.html');

            fs.writeFile(file, $.html(), 'utf-8', (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(file);
            });
        });
    });
};
