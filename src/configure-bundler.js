import fs from 'fs';
import path from 'path';
import config from './webpack-config';
import configure from './configure-webpack';
import existsFileAsync from './exists-file-async';

export default function(options) {
    const WORKINGDIR = options.root;
    const OUTPUTFILE = options.output || '[name].bundle.js';

    return Promise.all(
        options.entry.map(
            f => existsFileAsync(fs, path.join(WORKINGDIR, f))
        )
    )
    .then(files => {
        const entry = {};

        for (const f of files) {
            entry[path.basename(f, '.js')] = f;
        }

        return configure(config, {
            context: WORKINGDIR,
            devtool: options.devtool,
            production: options.production,
            output: {
                path: WORKINGDIR,
                filename: OUTPUTFILE,
                sourceMapFilename: OUTPUTFILE + '.map'
            },
            entry,
        });
    });
}
