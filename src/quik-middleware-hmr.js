import expand from 'glob-expand';
import compose from 'koa-compose';
import webpack from 'webpack';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import config from './webpack-config';
import configure from './configure-webpack';
import babelrc from './babelrc';

export default function(options) {
    const WORKINGDIR = options.root;

    const BABEL_LOADER = 'babel-loader?' + JSON.stringify(Object.assign({}, babelrc, {
        presets: [
            ...babelrc.presets,
            require.resolve('babel-preset-react-hmre')
        ]
    }));

    const loaders = config.module.loaders.slice();

    for (const loader of loaders) {
        if (loader.loader && loader.loader.indexOf('babel') > -1) {
            loader.loader = BABEL_LOADER;
        } else if (loader.loaders) {
            for (let i = 0, l = loader.loaders.length; i < l; i++) {
                if (loader.loaders[i].indexOf('babel') > -1) {
                    loader.loaders[i] = BABEL_LOADER;
                    break;
                }
            }
        }
    }

    const expanded = expand({ cwd: WORKINGDIR }, options.entry);
    const entry = {};

    for (const e of expanded) {
        entry[e] = [ './' + e, 'webpack-hot-middleware/client' ];
    }

    const compiler = configure(Object.assign({}, config, {
        module: Object.assign({}, config.modules, {
            loaders,
        })
    }), {
        entry,
        plugins: [ new webpack.HotModuleReplacementPlugin() ],
        context: WORKINGDIR,
        output: {
            path: WORKINGDIR,
            publicPath: '/',
            filename: '[name]'
        },
    });

    return compose([
        webpackDevMiddleware(compiler, {
            publicPath: '/',
            noInfo: true
        }),
        webpackHotMiddleware(compiler)
    ]);
}
