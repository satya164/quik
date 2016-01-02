#! /usr/bin/env node

'use strict';

const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const ncp = require('ncp');
const opn = require('opn');
const chalk = require('chalk');
const quik = require('../index');
const pak = require('../package.json');

const argv = yargs.array('watch').array('bundle').argv;

if (argv.version) {
    console.log(pak.version);
} else if (argv.init) {
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
    })
    .then(result => {
        const assets = result.assetsByChunkName;
        const bundles = [];

        for (const b in assets) {
            bundles.push(path.resolve(process.cwd(), assets[b][0]));
        }

        console.log(`Bundle${bundles.length > 1 ? 's' : ''} generated at ${bundles.map(b => chalk.green(b)).join(', ')}`);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
} else {
    quik.server({
        root: process.cwd(),
        port: argv.port,
        watch: argv.watch
    })
    .then(url => {
        console.log(`Quik is serving files at ${chalk.blue(url)}`);

        return url;
    })
    .then(opn)
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
}
