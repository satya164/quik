import webpack from 'webpack';
import path from 'path';
import loaders from './webpack-loaders';

const CURRENTDIR = path.join(__dirname, '..');

export default {
    devtool: 'inline-source-map',
    plugins: [
        new webpack.NoErrorsPlugin(),
    ],
    module: {
        loaders,
    },
    resolveLoader: {
        modules: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    },
    resolve: {
        extensions: [ '', '.web.js', '.js' ],
        modules: [
            path.join(CURRENTDIR, 'node_modules')
        ]
    },
};
