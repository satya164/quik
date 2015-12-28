#! /usr/bin/env node

var opn = require('opn'),
    quik = require('../index');

var arg = process.argv[2];

if (arg === 'init') {
    var name = process.argv[3];

    if (!name) {
        console.log('Please specify a name for the project');
        process.exit(1);
    }

    quik.init(name);
} else {
    var port = arg ? parseInt(arg, 10) : 3000;

    quik.server(port);
    opn('http://localhost:' + port);
}
