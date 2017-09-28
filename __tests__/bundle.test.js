import path from 'path';
import fs from 'fs';
import del from 'del';
import mkdirp from 'mkdirp';
import bundle from '../src/bundler';
import readFileAsync from '../src/read-file-async';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const TESTDIR = '/tmp/quik-test-' + Date.now();
const WORKINGDIR = path.join(__dirname, '../template');

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

it('should bundle for development', async () => {
  await bundle({
    root: WORKINGDIR,
    entry: ['index.js'],
    output: path.relative(WORKINGDIR, path.join(TESTDIR, '[name].bundle.js')),
    sourcemaps: true,
    quiet: true,
  });

  const js = await readFileAsync(fs, path.join(TESTDIR, 'index.bundle.js'));

  expect(js).not.toMatch('import React from');
  expect(js).toMatch('function _interopRequireDefault');
  expect(js).toMatch('/******/ (function(modules) { // webpackBootstrap');
  expect(js).toMatch('//# sourceMappingURL=index.bundle.js.map');

  const map = await readFileAsync(
    fs,
    path.join(TESTDIR, 'index.bundle.js.map')
  );

  expect(map).toMatch(
    '"webpack:///../node_modules/react/cjs/react.development.js"'
  );
});

it('should not generate sourcemaps for development', async done => {
  await bundle({
    root: WORKINGDIR,
    entry: ['index.js'],
    output: path.relative(WORKINGDIR, path.join(TESTDIR, '[name].bundle.0.js')),
    quiet: true,
  });

  try {
    await readFileAsync(fs, path.join(TESTDIR, 'index.bundle.0.js.map'));
    done.fail("sourcemap shouldn't exist");
  } catch (e) {
    expect(e.code).toEqual('ENOENT');
    done();
  }
});

it('should bundle for production', async () => {
  await bundle({
    root: WORKINGDIR,
    entry: ['index.js'],
    output: path.relative(
      WORKINGDIR,
      path.join(TESTDIR, '[name].bundle.min.js')
    ),
    production: true,
    sourcemaps: true,
    quiet: true,
  });

  const js = await readFileAsync(fs, path.join(TESTDIR, 'index.bundle.min.js'));

  expect(js).not.toMatch('import React from');
  expect(js).toMatch('Minified exception occurred;');
  expect(js).toMatch('!function(e){function t(r){if(n[r])return n[r].e');
  expect(js).toMatch('//# sourceMappingURL=index.bundle.min.js.map');

  const map = await readFileAsync(
    fs,
    path.join(TESTDIR, 'index.bundle.min.js.map')
  );

  expect(map).toMatch(
    '"webpack:///../node_modules/react/cjs/react.production.min.js"'
  );
});

it('should not generate sourcemaps for production', async done => {
  await bundle({
    root: WORKINGDIR,
    entry: ['index.js'],
    output: path.relative(
      WORKINGDIR,
      path.join(TESTDIR, '[name].bundle.0.min.js')
    ),
    production: true,
    quiet: true,
  });

  try {
    await readFileAsync(fs, path.join(TESTDIR, 'index.bundle.0.min.js.map'));
    done.fail("sourcemap shouldn't exist");
  } catch (e) {
    expect(e.code).toEqual('ENOENT');
    done();
  }
});
