/* @flow */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import ncp from 'ncp';
import exists from 'command-exists';
import chalk from 'chalk';

export default async function(options: *) {
  if (typeof options.name !== 'string') {
    throw new Error('Please specify a name for the project!');
  }

  const dir = path.join(options.root, options.name);

  if (fs.existsSync(dir)) {
    throw new Error(`A folder named '${options.name}' already exits!`);
  }

  console.log('📃  Copying template files');

  await new Promise((resolve, reject) => {
    ncp.ncp(path.join(__dirname, '../template/'), dir, err => {
      if (err) {
        reject(err);
        return;
      }

      exists('yarn', (error, status) => {
        if (error) {
          reject(error);
          return;
        }

        try {
          console.log(
            `🍭  Installing ${chalk.bold('react')} and ${chalk.bold(
              'react-dom'
            )}`
          );

          if (status) {
            execSync('yarn add react react-dom', { cwd: dir });
          } else {
            execSync('npm install -S react react-dom', { cwd: dir });
          }

          console.log(`💎  Adding ${chalk.bold('quik')} as a devDependency`);

          if (status) {
            execSync('yarn add --dev quik', { cwd: dir });
          } else {
            execSync('npm install -D quik', { cwd: dir });
          }

          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  });
}
