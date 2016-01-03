'use strict';

module.exports = function(fs, file) {
    return new Promise((resolve, reject) => {
        fs.exists(file, (exists) => {
            if (exists) {
                resolve(file);
            } else {
                reject(new Error('File not found: ' + file));
            }
        });
    });
};
