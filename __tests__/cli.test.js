import path from 'path';
import child_process from 'child_process';
import fs from 'fs';
import del from 'del';
import mkdirp from 'mkdirp';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const TESTDIR = '/tmp/quik-test-' + Date.now();
const PROJECT_NAME = 'AwesomeProject';

beforeAll(() =>
  del(TESTDIR, { force: true }).then(
    () =>
      new Promise((resolve, reject) => {
        mkdirp(TESTDIR, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
  )
);

afterAll(() => del(TESTDIR, { force: true }));

it('should print usage', done => {
  child_process.execFile(
    path.join(__dirname, '../bin/quik.js'),
    ['--help'],
    {},
    (err, stdout) => {
      if (err) {
        done.fail(err);
      } else {
        expect(stdout.startsWith('Usage: bin/quik.js [...options]')).toBe(true);
        done();
      }
    }
  );
});

it('should initialize project with template', done => {
  child_process.execFile(
    path.join(__dirname, '../bin/quik.js'),
    ['--init', PROJECT_NAME],
    {
      cwd: TESTDIR,
    },
    err => {
      if (err) {
        done.fail(err);
      } else {
        fs.readdir(path.join(TESTDIR, PROJECT_NAME), (error, res) => {
          if (error) {
            done.fail(error);
          } else {
            expect(res).toContain('package.json');
            expect(res).toContain('index.html');
            expect(res).toContain('index.js');
            expect(res).toContain('MyComponent.js');
            done();
          }
        });
      }
    }
  );
});
