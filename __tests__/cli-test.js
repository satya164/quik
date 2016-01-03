'use strict';

const test = require('blue-tape');
const path = require('path');
const child_process = require('child_process');

test('should print usage', t => {
    child_process.execFile(path.join(__dirname, '../bin/quik.js'), [ '--help' ], {}, (err, stdout) => {
        if (err) {
            t.fail(err.message);
        } else {
            t.equal(stdout.indexOf('Usage: bin/quik.js [...options]'), 0);
            t.end();
        }
    });
});
