/* @flow */

import path from 'path';
import MemoryFS from 'memory-fs';
import readFileAsync from './read-file-async';
import runCompilerAsync from './run-compiler-async';
import formatError from './format-error';
import bundler from './configure-bundler';
const CONTENT_TYPE = 'application/javascript';

export default function(options: *) {
  const WORKINGDIR = options.root;

  const test = file => file.endsWith('.js');

  return async function(ctx: *, next: *) {
    if (
      ctx.method === 'GET' &&
      ctx.accepts(CONTENT_TYPE) &&
      test(ctx.path) &&
      ctx.query.transpile !== 'false'
    ) {
      const OUTPUTFILE = 'output.js';

      ctx.type = CONTENT_TYPE;

      try {
        const compiler = await bundler({
          devtool: options.devtool,
          root: options.root,
          entry: [path.join('.', ctx.path)],
          output: OUTPUTFILE,
          production: false,
        });

        const memoryFs = new MemoryFS();

        compiler.outputFileSystem = memoryFs;

        const status = await runCompilerAsync(compiler);
        const result = status.toJson();

        if (result.errors.length) {
          throw result.errors;
        }

        ctx.body = await readFileAsync(
          memoryFs,
          path.join(WORKINGDIR, OUTPUTFILE)
        );
      } catch (e) {
        ctx.body = formatError(e);
      }
    }

    await next();
  };
}
