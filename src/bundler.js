import configure from './configure-bundler';
import runCompilerAsync from './run-compiler-async';

export default async function(options) {
    const compiler = await configure({ ...options, devtool: 'source-map' });
    const status = await runCompilerAsync(compiler);

    if (!options.quiet) {
        console.log(status.toString({
            colors: true
        }));
    }

    const result = status.toJson();

    if (result.errors.length) {
        throw result.errors;
    }

    return result;
}
