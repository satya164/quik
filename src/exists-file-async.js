export default function(fs, file) {
    return new Promise((resolve, reject) => {
        fs.access(file, fs.R_OK, error => {
            if (error) {
                reject(error);
            } else {
                resolve(file);
            }
        });
    });
}
