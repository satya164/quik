#! /usr/bin/env node

const opn = require('opn');
const argv = require('yargs').argv;
const quik = require('../index');

if (argv.init) {
    const name = argv.init;

    if (!name) {
        console.log('Please specify a name for the project');
        process.exit(1);
    }

    quik.init(name);
} else {
    const port = argv.port || 3000;

    quik.server(port);
    opn('http://localhost:' + port);
}
