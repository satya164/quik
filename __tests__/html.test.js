import path from 'path';
import fs from 'fs';
import del from 'del';
import mkdirp from 'mkdirp';
import html from '../src/html';
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

it('should build html without an entry file', async () => {
  await html({
    root: WORKINGDIR,
    output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.magic.html')),
    sourcemaps: true,
    quiet: true,
  });

  const data = await readFileAsync(fs, path.join(TESTDIR, 'output.magic.html'));

  expect(data.indexOf('<title>Quik Playground</title>') > -1).toBe(true);
  expect(data.indexOf('import React from') === -1).toBe(true);
  expect(data.indexOf('function _interopRequireDefault') > -1).toBe(true);
  expect(
    data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1
  ).toBe(true);
  expect(
    data.indexOf(
      '//# sourceMappingURL=data:application/json;charset=utf-8;base64'
    ) > -1
  ).toBe(true);
});

it('should build html without an entry file when JavaScript file is specified', async () => {
  await html({
    root: WORKINGDIR,
    output: path.relative(
      WORKINGDIR,
      path.join(TESTDIR, 'output.magic.1.html')
    ),
    js: 'MyComponent.js',
    sourcemaps: true,
    quiet: true,
  });

  const data = await readFileAsync(
    fs,
    path.join(TESTDIR, 'output.magic.1.html')
  );

  expect(data.indexOf('<title>Quik Playground</title>') > -1).toBe(true);
  expect(data.indexOf('import React from') === -1).toBe(true);
  expect(data.indexOf('function _interopRequireDefault') > -1).toBe(true);
  expect(
    data.indexOf(
      "_reactDom2.default.render(_react2.default.createElement(_MyComponent2.default, null), document.getElementById('root'))"
    ) === -1
  ).toBe(true);
});

it('should build html for development', async () => {
  await html({
    root: WORKINGDIR,
    entry: 'index.html',
    output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.html')),
    sourcemaps: true,
    quiet: true,
  });

  const data = await readFileAsync(fs, path.join(TESTDIR, 'output.html'));

  expect(data.indexOf('<!DOCTYPE html>') > -1).toBe(true);
  expect(data.indexOf('import React from') === -1).toBe(true);
  expect(data.indexOf('function _interopRequireDefault') > -1).toBe(true);
  expect(
    data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1
  ).toBe(true);
  expect(
    data.indexOf(
      '//# sourceMappingURL=data:application/json;charset=utf-8;base64'
    ) > -1
  ).toBe(true);
});

it('should not add sourcemap for development', async () => {
  await html({
    root: WORKINGDIR,
    entry: 'index.html',
    output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.0.html')),
    quiet: true,
  });

  const data = await readFileAsync(fs, path.join(TESTDIR, 'output.0.html'));
  expect(
    data.indexOf(
      '//# sourceMappingURL=data:application/json;charset=utf-8;base64'
    ) === -1
  ).toBe(true);
});

it('should build html for production', async () => {
  await html({
    root: WORKINGDIR,
    entry: 'index.html',
    output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.min.html')),
    sourcemaps: true,
    production: true,
    quiet: true,
  });

  const data = await readFileAsync(fs, path.join(TESTDIR, 'output.min.html'));

  expect(data.indexOf('<!DOCTYPE html>') > -1).toBe(true);
  expect(data.indexOf('import React from') === -1).toBe(true);
  expect(data.indexOf('Minified exception occurred;') > -1).toBe(true);
  expect(
    data.indexOf('!function(e){function t(r){if(n[r])return n[r].e') > -1
  ).toBe(true);
  expect(
    data.indexOf(
      '//# sourceMappingURL=data:application/json;charset=utf-8;base64'
    ) > -1
  ).toBe(true);
});

it('should not add sourcemap for production', async () => {
  await html({
    root: WORKINGDIR,
    entry: 'index.html',
    output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.0.min.html')),
    production: true,
    quiet: true,
  });

  const data = await readFileAsync(fs, path.join(TESTDIR, 'output.0.min.html'));

  expect(
    data.indexOf(
      '//# sourceMappingURL=data:application/json;charset=utf-8;base64'
    ) === -1
  ).toBe(true);
});
