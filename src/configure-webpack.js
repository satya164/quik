import path from 'path';
import webpack from 'webpack';
import babelrc from './babelrc';

const CURRENTDIR = path.join(__dirname, '..');

export const extensions = [ '', '.web.js', '.js' ];

export default (options) => ({
    context: options.context,
    entry: options.entry,
    output: options.output,
    devtool: options.devtool,

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: options.production ? '"production"' : '"developement"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: !!options.production,
            debug: !options.production
        }),
    ]
    .concat(options.production ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
        }),
    ] : [])
    .concat(options.plugins || []),

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader?' + JSON.stringify(babelrc),
            },
            { test: /\.json$/, loader: 'json' },
            { test: /\.css$/, loaders: [ 'style', 'css' ] },
            { test: /\.sass$/, loaders: [ 'style', 'css', 'sass?indentedSyntax' ] },
            { test: /\.scss$/, loaders: [ 'style', 'css', 'sass' ] },
            { test: /\.(gif|jpg|png)$/, loader: 'url?limit=25000' },
        ]
    },

    resolveLoader: {
        modules: [
            path.join(CURRENTDIR, 'node_modules'),
            path.resolve(options.context, 'node_modules'),
        ],
    },

    resolve: {
        extensions,
        modules: [
            path.join(CURRENTDIR, 'node_modules'),
            path.resolve(options.context, 'node_modules'),
        ],
    }
});
