import path from 'path';
import MemoryFS from 'memory-fs';
import readFileAsync from './read-file-async';
import runCompilerAsync from './run-compiler-async';
import formatError from './format-error';
import configure from './configure-bundler';

const CONTENT_TYPE = 'application/javascript';

export default function(options) {
    const WORKINGDIR = options.root;

    const test = file => /(\.(js|cjsx|coffee))$/.test(file);

    return function *(next) {
        if (this.method === 'GET' && this.accepts(CONTENT_TYPE) && test(this.path)) {
            const OUTPUTFILE = 'output.js';

            this.type = CONTENT_TYPE;
            this.body = yield configure({
                root: options.root,
                entry: [ path.join('.', this.path) ],
                output: OUTPUTFILE,
                production: false
            })
            .then(async compiler => {
                const memoryFs = new MemoryFS();

                compiler.outputFileSystem = memoryFs;

                const status = await runCompilerAsync(compiler);
                const result = status.toJson();

                if (result.errors.length) {
                    throw result.errors;
                }

                return await readFileAsync(memoryFs, path.join(WORKINGDIR, OUTPUTFILE));
            })
            .catch(formatError);
        }

        yield next;
    };
}
