'use strict';

const path = require('path');
const ncp = require('ncp');

const BABEL_PRESETS = [ 'react', 'es2015', 'stage-1' ];

module.exports = function(name) {
    const projectDir = path.join(process.cwd(), name);

    ncp.ncp(path.join(__dirname, '../template/'), projectDir, err => {
        if (err) {
            return console.error(err);
        }

        console.log('Project initialized successfully!');
    });
};
