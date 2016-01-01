#! /usr/bin/env node

'use strict';

const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const ncp = require('ncp');
const opn = require('opn');
const chalk = require('chalk');
const quik = require('../index');

const argv = yargs.array('watch').array('bundle').argv;

if (argv.init) {
    const name = argv.init;

    if (typeof name !== 'string') {
        console.log('Please specify a name for the project!');
        process.exit(1);
    }

    if (fs.existsSync(path.join(process.cwd(), name))) {
        console.log(`A folder named '${name}' already exits!`);
        process.exit(1);
    }

    ncp.ncp(path.join(__dirname, '../template/'), path.join(process.cwd(), name), err => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        console.log('Project initialized successfully!');
    });
} else if (argv.bundle) {
    quik.bundle({
        root: process.cwd(),
        entry: argv.bundle.map(it => './' + it),
        output: argv.output,
        production: argv.production
    }).then(output => {
        console.log(`Bundle generated at ${chalk.green(output)}`);
    });
} else {
    quik.server({
        root: process.cwd(),
        port: argv.port,
        watch: argv.watch
    }).then(url => {
        console.log(`Quik is serving files at ${chalk.blue(url)}`);

        return url;
    }).then(opn);
}
