/* @flow */

import expand from 'glob-expand';
import webpack from 'webpack';
import webpackMiddleware from 'koa-webpack';
import configure from './configure-webpack';
import babelrc from './babelrc';

export default function(options: *) {
  const WORKINGDIR = options.root;

  const expanded = expand({ cwd: WORKINGDIR }, options.entry);
  const entry = {};

  for (const e of expanded) {
    entry[e] = ['./' + e, 'webpack-hot-middleware/client'];
  }

  const config = configure({
    context: WORKINGDIR,
    devtool: options.devtool,
    production: false,
    plugins: [new webpack.HotModuleReplacementPlugin()],
    output: {
      path: WORKINGDIR,
      publicPath: '/',
      filename: '[name]',
    },
    entry,
  });

  const BABEL_LOADER =
    'babel-loader?' +
    JSON.stringify({
      ...babelrc,
      presets: [...babelrc.presets, require.resolve('babel-preset-react-hmre')],
    });

  const loaders = config.module.rules;

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

  return webpackMiddleware({
    config,
    dev: {
      publicPath: '/',
      noInfo: true,
    },
  });
}
