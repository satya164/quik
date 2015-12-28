import path from 'path';
import ncp from 'ncp';
import setupDeps from './setup-deps';

const BABEL_PRESETS = [ 'react', 'es2015', 'stage-1' ];

export default function(name) {
    const projectDir = path.join(process.cwd(), name);

    ncp.ncp(path.join(__dirname, '../template/'), projectDir, err => {
        if (err) {
            return console.error(err);
        }

        setupDeps(projectDir, BABEL_PRESETS.map(preset => 'babel-preset-' + preset));

        console.log('Project initialized successfully!');
    });
}
