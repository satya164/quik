/* @flow */

export default function(error: Error) {
  return `
        /* show error response on build fail */
        document.body.onload = function() {
            document.body.style.background = 'rgb(255, 221, 221)';
            document.body.style.color = 'rgb(0, 0, 0)';
            document.body.style.padding = '10px';
            document.body.style.whiteSpace = 'pre';
            document.body.style.fontFamily = 'monospace';

            document.body.textContent = '${error
              .toString()
              .replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
              .replace(/\n/g, '\\n')}';
        }
    `;
}
