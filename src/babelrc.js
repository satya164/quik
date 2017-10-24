/* @flow */

const babelrc = {
  presets: [
    [
      require.resolve('babel-preset-env'),
      {
        modules: false,
        targets: {
          browsers: ['last 2 versions', 'safari >= 7'],
        },
      },
    ],
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-2'),
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
