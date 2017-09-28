/* @flow */

export default function(compiler: *): Promise<Object> {
  return new Promise((resolve, reject) => {
    compiler.run((error, status) => {
      if (error) {
        reject(error);
      } else {
        resolve(status);
      }
    });
  });
}
