import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import babelrc from './babelrc';

const CURRENTDIR = path.join(__dirname, '..');
const BABEL_LOADER = 'babel-loader?' + JSON.stringify(babelrc);
const CSS_LOADER = 'css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]';
const SASS_LOADER = 'sass-loader?sourceMap';
const LESS_LOADER = 'less-loader?sourceMap';
const STYLE_LOADERS = [ 'style-loader', CSS_LOADER, 'postcss-loader' ];

export const extensions = [ '', '.web.js', '.js', '.jsx' ];

export default (options) => ({
    context: options.context,
    entry: options.entry,
    output: options.output,
    devtool: options.devtool,

    postcss() {
        return [ autoprefixer ];
    },

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
            sourceMap: !!options.devtool,
        }),
    ] : [])
    .concat(options.plugins || []),

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: BABEL_LOADER,
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
            {
                test: /\.css$/,
                loaders: STYLE_LOADERS,
            },
            {
                test: /\.less$/,
                loaders: [ ...STYLE_LOADERS, LESS_LOADER ],
            },
            {
                test: /\.scss$/,
                loaders: [ ...STYLE_LOADERS, SASS_LOADER ],
            },
            {
                test: /\.(gif|jpg|png|webp|svg)$/,
                loader: 'url?limit=25000',
            },
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
