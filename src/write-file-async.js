/* @flow */

export default function(
  fs: *,
  file: string,
  content: string,
  encoding: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, encoding, error => {
      if (error) {
        reject(error);
      } else {
        resolve(file);
      }
    });
  });
}
