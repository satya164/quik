'use strict';

module.exports = function(fs, file) {
    return new Promise((resolve, reject) => {
        fs.exists(file, (exists) => {
            if (exists) {
                resolve(file);
            } else {
                const error = new Error(`File doesn't exist: '${file}'`);

                error.code = 'ENOENT';

                reject(error);
            }
        });
    });
};
