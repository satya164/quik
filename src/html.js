'use strict';

const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const MemoryFS = require('memory-fs');
const configure = require('./configure');

module.exports = function(options) {
    const readFile = (fsImpl, file) => new Promise((resolve, reject) => {
        fsImpl.readFile(file, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.toString());
            }
        });
    });

    const compile = compiler => {
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

                resolve(path.join(options.root, 'output.js'));
            });
        }).then(file => readFile(memoryFs, file));
    };

    return readFile(fs, path.join(options.root, options.entry))
    .then(result => {
        const $ = cheerio.load(result);

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
                    .then(compile)
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
    });
};
