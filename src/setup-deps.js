'use strict';

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

module.exports = function(dir, packages) {
    for (let pak of packages) {
        if (!fs.existsSync(path.join(dir, 'node_modules', pak))) {
            console.log(`Installing package '${pak}'`);
            child_process.execSync('npm install ' + pak, { cwd: dir });
        }
    }
};
