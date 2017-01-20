/* @flow */

import path from 'path';
import webpack from 'webpack';
import babelrc from './babelrc';

type Options = {
  context: string;
  plugins?: ?Array<*>;
  entry: { [key: string]: string };
  output: {
    path: string;
    filename: string;
    sourceMapFilename?: string;
  };
  devtool: boolean;
  production: boolean;
}

type Loader = {
  loader: string;
  options?: Object;
}

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
const STYLE_LOADER = {
  loader: 'style-loader',
};
const CSS_LOADER = {
  loader: 'css-loader',
  options: {
    modules: true,
    importLoaders: 2,
    localIdentName: '[local]___[hash:base64:5]',
  },
};
const SASS_LOADER = {
  loader: 'sass-loader',
  options: {
    sourceMap: true,
  },
};
const LESS_LOADER = {
  loader: 'less-loader',
  options: {
    sourceMap: true,
  },
};
const POSTCSS_LOADER = {
  loader: 'postcss-loader',
};
const STYLE_LOADERS: Array<Loader> = [ STYLE_LOADER, CSS_LOADER, POSTCSS_LOADER ];

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
      postcss: [
        require('autoprefixer'),
      ],
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
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: BABEL_LOADER,
      },
      {
        test: /\.css$/,
        use: STYLE_LOADERS,
      },
      {
        test: /\.less$/,
        use: [ ...STYLE_LOADERS, LESS_LOADER ],
      },
      {
        test: /\.scss$/,
        use: [ ...STYLE_LOADERS, SASS_LOADER ],
      },
      {
        test: /\.(gif|jpg|png|webp|svg)$/,
        use: URL_LOADER,
      },
    ],
  },

  resolveLoader: {
    modules: [
      path.join(CURRENTDIR, 'node_modules'),
      path.resolve(options.context, 'node_modules'),
    ],
  },

  resolve: {
    modules: [
      path.join(CURRENTDIR, 'node_modules'),
      path.resolve(options.context, 'node_modules'),
    ],
  },
});
