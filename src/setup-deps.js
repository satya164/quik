import path from 'path';
import fs from 'fs';
import child_process from 'child_process';

function setup(dir, packages) {
    for (const pak of packages) {
        if (!fs.existsSync(path.join(dir, 'node_modules', pak))) {
            console.log(`Installing package '${pak}'`);
            child_process.execSync('npm install ' + pak, { cwd: dir });
        }
    }
}

export default setup;
