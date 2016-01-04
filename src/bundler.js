'use strict';

const configure = require('./configure');

module.exports = function(options) {
    return configure(Object.assign({}, options, {
        devtool: 'source-map'
    })).then(compiler => {
        return new Promise((resolve, reject) => {
            compiler.run((err, status) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!options.quiet) {
                    console.log(status.toString({
                        colors: true
                    }));
                }

                const result = status.toJson();

                if (result.errors.length) {
                    reject(result.errors);
                    return;
                }

                resolve(result);
            });
        });
    });
};
