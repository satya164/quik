'use strict';

const CONTENT_TYPE = 'text/html';

module.exports = function(options) {
    return function *(next) {
        if (this.method === 'GET' && this.accepts(CONTENT_TYPE) && /^\/(index\.html)?$/.test(this.path)) {
            this.type = CONTENT_TYPE;
            this.body = `
                <!DOCTYPE html>
                    <head>
                        <meta charset="utf-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">

                        <title>Quik Playground</title>
                    </head>
                    <body>
                        <div id="root"></div>

                        <script src="${options.script}"></script>
                    </body>
                </html>
            `;
        }

        yield next;
    };
};
