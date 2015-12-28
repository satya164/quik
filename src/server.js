import koa from 'koa';
import send from 'koa-send';
import webpackMiddleware from './webpack-middleware';

const WORKINGDIR = process.cwd();

export default function(port) {
    const app = koa();

    app.use(webpackMiddleware);
    app.use(function *() {
        if (this.method === 'GET') {
            if (!/(\.js)$/.test(this.path)) {
                const file = this.path === '/' ? '/index.html' : this.path;

                yield send(this, file, { root: WORKINGDIR });
            }
        } else {
            this.throw(401);
        }
    });

    app.listen(port);

    console.log(`Server listening on ${port}`);
}
