require('source-map-support').install();
require('babel-polyfill');
require('babel-register');

module.exports = {
    server: require('./src/server').default,
    init: require('./src/setup-template').default
};
