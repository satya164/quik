import webpack from 'webpack';
import path from 'path';
import MemoryFS from 'memory-fs';

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
                    presets: [ 'react', 'es2015', 'stage-1' ]
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    resolve: {
        fallback: [ path.join(__dirname, '../node_modules') ]
    },
    resolveLoader: {
        root: path.join(__dirname, '../node_modules')
    }
};

export default function *(next) {
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
}
