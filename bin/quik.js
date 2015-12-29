#! /usr/bin/env node

'use strict';

const opn = require('opn');
const yargs = require('yargs');
const quik = require('../index');

const argv = yargs.array('watch').argv;

if (argv.init) {
    const name = argv.init;

    if (!name) {
        console.log('Please specify a name for the project');
        process.exit(1);
    }

    quik.init(name);
} else {
    const port = argv.port || 3000;

    quik.server(port, argv.watch);
    opn('http://localhost:' + port);
}
