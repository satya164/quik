'use strict';

const config = require('./webpack-config');

module.exports = function(options) {
    return Object.assign({}, config, {
        context: options.root
    });
};
