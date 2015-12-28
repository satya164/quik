import path from 'path';
import fs from 'fs';
import child_process from 'child_process';

const WORKINGDIR = process.cwd();

function setup(packages) {
    for (const pak of packages) {
        if (!fs.existsSync(path.join(WORKINGDIR, 'node_modules', pak))) {
            console.log(`Installing package '${pak}'`);
            child_process.execSync('npm install ' + pak);
        }
    }
}

export default setup;
