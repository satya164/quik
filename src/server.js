/* @flow */

import Koa from 'koa';
import serve from 'koa-static';
import logger from 'koa-logger';
import quik from './quik-middleware';

export default function(options: *) {
  const app = new Koa();

  app.use(logger());
  app.use(quik(options));
  app.use(serve(options.root, { defer: true }));

  return app;
}
