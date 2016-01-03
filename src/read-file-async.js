'use strict';

module.exports = (fsImpl, file) => new Promise((resolve, reject) => {
    fsImpl.readFile(file, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result.toString());
        }
    });
});
