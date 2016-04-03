import path from 'path';
import fs from 'fs';
import cheerio from 'cheerio';
import MemoryFS from 'memory-fs';
import readFileAsync from './read-file-async';
import writeFileAsync from './write-file-async';
import bundler from './configure-bundler';
import runCompilerAsync from './run-compiler-async';
import formatHTML from './format-html';

export default async function(options) {
    const isRemote = uri => /^((https?:)?\/\/)/.test(uri);
    const ignoreTranspile = uri => /(\?|\?.+&)transpile=false/.test(uri);
    const ignoreInline = uri => /(\?|\?.+&)inline=false/.test(uri);

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

    let result;

    if (options.entry) {
        result = await readFileAsync(fs, path.join(options.root, options.entry));
    } else {
        result = formatHTML('index.js');
    }

    const $ = cheerio.load(result);

    await Promise.all(
        $('script').map(async (i, el) => {
            const src = $(el).attr('src');

            if (isRemote(src) || ignoreInline(src)) {
                return;
            }

            let content;

            if (ignoreTranspile(src)) {
                content = await readFileAsync(fs, path.join(options.root, src.split('?')[0]));
            } else {
                const parent = options.entry ? path.dirname(path.join(options.root, options.entry)) : options.root;
                const compiler = await bundler({
                    root: options.root,
                    entry: [ './' + path.relative(options.root, path.join(parent, src)) ],
                    output: 'output.js',
                    production: options.production
                });
                content = await compile(compiler);
            }

            $(el).attr('src', null);
            $(el).text(content);
        })
        .get()
    );

    await Promise.all(
        $('link[rel=stylesheet]').map(async (i, el) => {
            const src = $(el).attr('href');

            if (isRemote(src) || ignoreInline(src)) {
                return;
            }

            const content = await readFileAsync(fs, path.join(options.root, src.split('?')[0]));
            const $style = $('<style type="text/css">');

            $style.text(content);

            $(el).replaceWith($style);
        })
        .get()
    );

    const file = path.join(options.root, options.output || (options.entry ? path.basename(options.entry, '.html') : 'index') + '.quik.html');

    return await writeFileAsync(fs, file, $.html(), 'utf-8');
}
