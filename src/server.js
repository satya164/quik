import koa from 'koa';
import serve from 'koa-static';
import logger from 'koa-logger';
import quik from './quik-middleware';

export default function(options) {
  const app = koa();

  app.use(logger());
  app.use(quik(options));
  app.use(serve(options.root, { defer: true }));

  return app;
}
