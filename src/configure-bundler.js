import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import configure from './configure-webpack';
import existsFileAsync from './exists-file-async';

export default async function(options) {
    const WORKINGDIR = options.root;
    const OUTPUTFILE = options.output || '[name].bundle.js';

    const files = await Promise.all(
        options.entry.map(
            f => existsFileAsync(fs, path.join(WORKINGDIR, f))
        )
    );

    const entry = {};

    for (const f of files) {
        entry[path.basename(f, '.js')] = f;
    }

    return webpack(configure({
        context: WORKINGDIR,
        devtool: options.devtool ? options.devtool : false,
        production: options.production,
        output: {
            path: WORKINGDIR,
            filename: OUTPUTFILE,
            sourceMapFilename: OUTPUTFILE + '.map'
        },
        entry,
    }));
}
