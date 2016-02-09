#! /usr/bin/env node

'use strict';

require('babel-core/register');
require('babel-polyfill');

const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const ncp = require('ncp');
const opn = require('opn');
const chalk = require('chalk');
const quik = require('../index');
const pak = require('../package.json');

const argv = yargs
    .usage('Usage: $0 [...options]')
    .options({
        init: {
            type: 'string',
            description: 'Initialize a sample project'
        },
        port: {
            default: 3030,
            description: 'Port to listen on'
        },
        watch: {
            alias: 'w',
            type: 'array',
            description: 'Files to watch for changes'
        },
        bundle: {
            alias: 'b',
            type: 'array',
            description: 'Files to bundle'
        },
        html: {
            type: 'string',
            description: 'Name of the output sharable HTML file'
        },
        output: {
            alias: 'o',
            type: 'string',
            description: 'Name of the output file'
        },
        production: {
            type: 'boolean',
            default: false,
            description: 'Optimize bundle for production'
        }
    })
    .example('$0 --port 8008 --watch index.js', 'Start the server in the port \'8008\' and watch \'index.js\' for changes')
    .example('$0 --bundle entry.js --output bundle.js --production', 'Generate a bundle named \'bundle.js\' from \'entry.js\' for production')
    .example('$0 --html index.html --output bundle.html', 'Generate a sharable HTML file named \'bundle.html\' from \'index.html\'')
    .help('help')
    .version(pak.version)
    .strict()
    .argv;

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
    })
    .then(result => {
        const assets = result.assetsByChunkName;
        const bundles = [];

        for (const b in assets) {
            const entry = assets[b];

            bundles.push(path.resolve(process.cwd(), Array.isArray(entry) ? entry[0] : entry));
        }

        console.log(`Bundle${bundles.length > 1 ? 's' : ''} generated at ${bundles.map(b => chalk.green(b)).join(', ')}`);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
} else if (argv.html) {
    quik.html({
        root: process.cwd(),
        entry: './' + argv.html,
        output: argv.output,
        production: argv.production
    })
    .then(file => {
        console.log(`Sharable HTML generated at ${chalk.green(file)}`);
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
    }).listen(argv.port);

    const url = `http://localhost:${argv.port}`;

    console.log(`Quik is serving files at ${chalk.blue(url)}`);
    opn(url);
}
