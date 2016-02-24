export default {
    presets: [
        'es2015-native-modules',
        'react',
        'babel-preset-stage-1',
    ],
    plugins: [
        'transform-runtime',
    ],
    env: {
        production: {
            plugins: [
                'transform-react-constant-elements',
                'transform-react-inline-elements',
            ]
        }
    }
};
