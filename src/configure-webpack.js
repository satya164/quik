import path from 'path';
import webpack from 'webpack';

export default (config, options) => webpack({
    ...config,

    context: options.context,
    entry: options.entry,
    output: options.output,
    devtool: options.devtool || config.devtool,

    plugins: config.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: options.production ? '"production"' : '"developement"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: !!options.production,
            debug: !options.production
        }),
    )
    .concat(options.production ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
    ] : [])
    .concat(options.plugins || []),

    resolveLoader: {
        ...config.resolveLoader,
        modules: config.resolveLoader.modules.concat(
            path.resolve(options.context, 'node_modules'),
        ),
    },

    resolve: {
        ...config.resolve,
        modules: config.resolve.modules.concat(
            path.resolve(options.context, 'node_modules'),
        ),
    }
});
