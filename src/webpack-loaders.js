import babelrc from './babelrc';

export default [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?' + JSON.stringify(babelrc),
    },
    {
        test: /\.json$/,
        loader: 'json-loader',
    },
];
