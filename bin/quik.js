#! /usr/bin/env node

'use strict';

const yargs = require('yargs');
const path = require('path');
const ncp = require('ncp');
const opn = require('opn');
const quik = require('../index');

const argv = yargs.array('watch').argv;

if (argv.init) {
    const name = argv.init;

    if (!name) {
        console.log('Please specify a name for the project');
        process.exit(1);
    }

    ncp.ncp(path.join(__dirname, '../template/'), path.join(process.cwd(), name), err => {
        if (err) {
            return console.error(err);
        }

        console.log('Project initialized successfully!');
    });
} else {
    quik.server({
        root: process.cwd(),
        port: argv.port,
        watch: argv.watch
    }).then(opn);
}
