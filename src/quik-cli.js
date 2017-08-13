/* @flow */

import yargs from 'yargs';
import path from 'path';
import opn from 'opn';
import chalk from 'chalk';
import pak from '../package.json';
import { init, server, bundle, html } from './index';

const argv = yargs
  .usage('Usage: $0 [...options]')
  .options({
    init: {
      type: 'string',
      description: 'Initialize a sample project',
    },
    port: {
      default: 3030,
      description: 'Port to listen on',
    },
    run: {
      alias: 'r',
      type: 'string',
      description: 'Script to run in browser',
    },
    watch: {
      alias: 'w',
      type: 'array',
      description: 'Scripts to watch for changes',
    },
    bundle: {
      alias: 'b',
      type: 'array',
      description: 'Scripts to bundle',
    },
    html: {
      type: 'string',
      description: 'Name of the input file for sharable HTML bundle',
    },
    js: {
      type: 'string',
      description:
        'Name of the JavaScript file to include in the HTML bundle when no HTML is specified',
    },
    output: {
      alias: 'o',
      type: 'string',
      description: 'Name of the output file',
    },
    common: {
      type: 'string',
      description:
        'Name of file to contain common code in case of multiple entries',
    },
    production: {
      type: 'boolean',
      default: false,
      description: 'Optimize bundle for production',
    },
    sourcemaps: {
      type: 'boolean',
      default: true,
      description: 'Generate sourcemaps for bundle',
    },
    browser: {
      type: 'string',
      default: '',
      description: 'Name of using browser',
    },
  })
  .example(
    '$0 --run index.js',
    "Run the script 'index.js' in a browser and watch for changes"
  )
  .example(
    '$0 --port 8008 --watch index.js',
    "Start the server in the port '8008' and watch 'index.js' for changes"
  )
  .example(
    '$0 --bundle entry.js --output bundle.js --production',
    "Generate a bundle named 'bundle.js' from 'entry.js' for production"
  )
  .example(
    '$0 --html index.html --output bundle.html',
    "Generate a sharable HTML file named 'bundle.html' from 'index.html'"
  )
  .help('help')
  .version(pak.version)
  .strict().argv;

if (argv.init) {
  init({
    root: process.cwd(),
    name: argv.init,
  })
    .then(() => {
      console.log(
        '✨  All done!\n\n' +
          ` - Run ${chalk.bold(
            chalk.yellow('npm start')
          )} to start the server\n` +
          ` - Run ${chalk.bold(
            chalk.yellow('npm run build')
          )} to build production ready bundle\n`
      );
    })
    .catch(err => {
      console.log(err.message);
      process.exit(1);
    });
} else if (argv.bundle) {
  bundle({
    root: process.cwd(),
    entry: argv.bundle.map(it => './' + it),
    common: argv.common,
    output: argv.output,
    production: argv.production,
    sourcemaps: argv.sourcemaps,
  })
    .then(result => {
      const assets = result.assetsByChunkName;
      const bundles = [];

      for (const b in assets) {
        const entry = assets[b];

        bundles.push(
          path.resolve(process.cwd(), Array.isArray(entry) ? entry[0] : entry)
        );
      }

      console.log(
        `✨  Bundle${bundles.length > 1
          ? 's'
          : ''} generated at ${bundles
          .map(b => chalk.bold(chalk.green(path.relative(process.cwd(), b))))
          .join(', ')}`
      );
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else if (typeof argv.html === 'string') {
  html({
    root: process.cwd(),
    js: argv.js,
    entry: argv.html,
    output: argv.output,
    production: argv.production,
    sourcemaps: argv.sourcemaps,
  })
    .then(file => {
      console.log(
        `✨  Sharable HTML generated at ${chalk.bold(
          chalk.green(path.relative(process.cwd(), file))
        )}`
      );
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  server({
    root: process.cwd(),
    port: argv.port,
    run: argv.run,
    watch: argv.watch,
  }).listen(argv.port);

  const url = `http://localhost:${argv.port}`;

  console.log(`Quik is serving files at ${chalk.blue(url)}`);

  if (argv.browser) {
    opn(url, { app: argv.browser });
  } else {
    opn(url);
  }
}
