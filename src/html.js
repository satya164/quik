import path from 'path';
import fs from 'fs';
import cheerio from 'cheerio';
import MemoryFS from 'memory-fs';
import readFileAsync from './read-file-async';
import writeFileAsync from './write-file-async';
import bundler from './configure-bundler';
import runCompilerAsync from './run-compiler-async';

export default async function(options) {
    const compile = async compiler => {
        const memoryFs = new MemoryFS();

        compiler.outputFileSystem = memoryFs;

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

        return await readFileAsync(memoryFs, path.join(options.root, 'output.js'));
    };

    const result = await readFileAsync(fs, path.join(options.root, options.entry));
    const $ = cheerio.load(result);

    await Promise.all(
        $('script').map(async (i, el) => {
            const src = $(el).attr('src');

            if (/^((https?:)?\/\/)/.test(src) || /(\?|\?.+&)transpile=false/.test(src)) {
                return;
            }

            const compiler = await bundler({
                root: options.root,
                entry: [ './' + path.relative(options.root, path.join(path.dirname(path.join(options.root, options.entry)), src)) ],
                output: 'output.js',
                production: options.production
            });
            const content = await compile(compiler);

            $(el).attr('src', null);
            $(el).text(content);
        })
        .get()
    );

    const file = path.join(options.root, options.output || path.basename(options.entry, '.html') + '.quik.html');

    return await writeFileAsync(fs, file, $.html(), 'utf-8');
}
