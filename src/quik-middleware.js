import fs from 'fs';
import compose from 'koa-compose';
import hmr from './quik-middleware-hmr';
import js from './quik-middleware-js';
import run from './quik-middleware-run';

export default function(options) {
  const middlewares = [];

  middlewares.push(js({
    devtool: 'inline-source-map',
    root: options.root
  }));

  let script, watch;

  if (options.run) {
    script = options.run;
    watch = [ script ];
  } else if (options.watch) {
    watch = options.watch;
  } else {
    const index = 'index.js';

    try {
      fs.accessSync(index, fs.R_OK);
      watch = [ index ];
    } catch (e) {
            // Do nothing
    }

    try {
      fs.accessSync('index.html', fs.R_OK);
    } catch (e) {
      script = index;
    }
  }

  if (script) {
    middlewares.push(run({
      root: options.root,
      script
    }));
  }

  if (watch && watch.length) {
    middlewares.push(hmr({
      devtool: 'inline-source-map',
      root: options.root,
      entry: watch
    }));
  }

  return compose(middlewares);
}
