'use strict';

const webpack = require('webpack');
const path = require('path');
const MemoryFS = require('memory-fs');

const CURRENTDIR = path.join(__dirname, '..');
const WORKINGDIR = process.cwd();

const config = {
    context: WORKINGDIR,
    devtool: 'eval',
    plugins: [ new webpack.NoErrorsPlugin() ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        require.resolve('babel-preset-es2015'),
                        require.resolve('babel-preset-react'),
                        require.resolve('babel-preset-stage-1')
                    ]
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    resolveLoader: {
        root: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    },
    resolve: {
        root: [
            path.join(CURRENTDIR, 'node_modules'),
            path.join(WORKINGDIR, 'node_modules')
        ]
    }
};

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
}
