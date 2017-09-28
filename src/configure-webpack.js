/* @flow */

import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import babelrc from './babelrc';

type Options = {
  context: string,
  plugins?: ?Array<*>,
  entry: { [key: string]: string },
  output: {
    path: string,
    filename: string,
    sourceMapFilename?: string,
  },
  devtool: ?string,
  production: boolean,
};

const CURRENTDIR = path.join(__dirname, '..');

const BABEL_LOADER = {
  loader: 'babel-loader',
  options: babelrc,
};
const URL_LOADER = {
  loader: 'url-loader',
  options: {
    limit: 25000,
  },
};
const RESOLVE_URL = 'resolve-url-loader';
const STYLE_LOADER = 'style-loader';
const CSS_LITERAL_LOADER = 'css-literal-loader';
const CSS_LOADER = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
  },
};
const POSTCSS_LOADER = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss-options',
    plugins: () => [require('autoprefixer')],
    sourceMap: true,
  },
};

export default (options: Options) => ({
  context: options.context,
  entry: options.entry,
  output: options.output,
  devtool: options.devtool,

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: options.production ? '"production"' : '"developement"',
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: !!options.production,
      debug: !options.production,
    }),
  ]
    .concat(
      options.production
        ? [
            new webpack.optimize.UglifyJsPlugin({
              compress: { warnings: false },
              sourceMap: !!options.devtool,
            }),
            new ExtractTextPlugin({
              filename: 'style.css',
            }),
          ]
        : [new webpack.NamedModulesPlugin()]
    )
    .concat(options.plugins || []),

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [BABEL_LOADER, CSS_LITERAL_LOADER],
      },
      {
        test: /\.(gif|jpg|png|webp|svg)$/,
        use: URL_LOADER,
      },
      {
        test: /\.css$/,
        use: options.production
          ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [CSS_LOADER, RESOLVE_URL, POSTCSS_LOADER],
            })
          : [STYLE_LOADER, CSS_LOADER, RESOLVE_URL, POSTCSS_LOADER],
      },
    ],
  },

  resolveLoader: {
    modules: [
      path.join(CURRENTDIR, 'node_modules'),
      path.join(options.context, 'node_modules'),
    ],
  },

  resolve: {
    modules: [
      path.join(CURRENTDIR, 'node_modules'),
      path.join(options.context, 'node_modules'),
    ],
  },

  devServer: {
    stats: {
      colors: true,
      chunks: false,
    },
  },
});
