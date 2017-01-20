/* @flow */

const babelrc = {
  presets: [
    [ require.resolve('babel-preset-es2015'), { modules: false } ],
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-1'),
  ],
  plugins: [
    require.resolve('babel-plugin-transform-runtime'),
  ],
  env: {
    production: {
      plugins: [
        require.resolve('babel-plugin-transform-react-constant-elements'),
        require.resolve('babel-plugin-transform-react-inline-elements'),
      ],
    },
  },
};

export default babelrc;
