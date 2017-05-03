/* @flow */

import formatHTML from './format-html';

const CONTENT_TYPE = 'text/html';

export default function(options: *) {
  return function(ctx: *, next: *) {
    if (
      ctx.method === 'GET' &&
      ctx.accepts(CONTENT_TYPE) &&
      /^\/(index\.html)?$/.test(ctx.path)
    ) {
      ctx.type = CONTENT_TYPE;
      ctx.body = formatHTML(options.script);
    }

    return next();
  };
}
