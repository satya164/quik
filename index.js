require('source-map-support').install();
require('babel-polyfill');
require('babel-register');

module.exports = require('./src/server');
