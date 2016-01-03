'use strict';

module.exports = (fs, file) => new Promise((resolve, reject) => {
    fs.readFile(file, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result.toString());
        }
    });
});
