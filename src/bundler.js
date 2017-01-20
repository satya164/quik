/* @flow */

import bundler from './configure-bundler';
import runCompilerAsync from './run-compiler-async';

export default async function(options: *) {
  const compiler = await bundler({ ...options, devtool: options.sourcemaps ? 'source-map' : null });
  const status = await runCompilerAsync(compiler);

  if (!options.quiet) {
    console.log(status.toString({
      colors: true,
    }));
  }

  const result = status.toJson();

  if (result.errors.length) {
    throw result.errors;
  }

  return result;
}
