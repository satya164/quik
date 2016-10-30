import formatHTML from './format-html';

const CONTENT_TYPE = 'text/html';

export default function(options) {
  return function *(next) {
    if (this.method === 'GET' && this.accepts(CONTENT_TYPE) && /^\/(index\.html)?$/.test(this.path)) {
      this.type = CONTENT_TYPE;
      this.body = formatHTML(options.script);
    }

    yield next;
  };
}
