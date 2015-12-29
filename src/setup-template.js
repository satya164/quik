'use strict';

const path = require('path');
const ncp = require('ncp');

module.exports = function(name) {
    const projectDir = path.join(process.cwd(), name);

    ncp.ncp(path.join(__dirname, '../template/'), projectDir, err => {
        if (err) {
            return console.error(err);
        }

        console.log('Project initialized successfully!');
    });
};
