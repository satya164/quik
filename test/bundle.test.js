'use strict';

import test from 'ava';
import path from 'path';
import fs from 'fs';
import del from 'del';
import mkdirp from 'mkdirp';
import bundle from '../dist/bundler';
import readFileAsync from '../dist/read-file-async';

const TESTDIR = '/tmp/quik-test-' + Date.now();
const WORKINGDIR = path.join(__dirname, '../template');

test.before('setup', () => del(TESTDIR, { force: true }).then(() =>
    new Promise((resolve, reject) => {
      mkdirp(TESTDIR, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
));

test.after('teardown', () => del(TESTDIR, { force: true }));

test('should bundle for development', t =>
    bundle({
      root: WORKINGDIR,
      entry: [ 'index.js' ],
      output: path.relative(WORKINGDIR, path.join(TESTDIR, '[name].bundle.js')),
      sourcemaps: true,
      quiet: true,
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'index.bundle.js')))
    .then(data => {
      t.true(data.indexOf('import React from') === -1, 'should be transpiled');
      t.true(data.indexOf('function _interopRequireDefault') > -1, 'should be transpiled');
      t.true(data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1, 'should not be minified');
      t.true(data.indexOf('//# sourceMappingURL=index.bundle.js.map') > -1, 'should have sourcemap');
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'index.bundle.js.map')))
    .then(data => {
      t.true(data.indexOf('"webpack:///../~/react/lib/ReactElement.js"') > -1, 'should have sourcemap');
    })
);

test('should not generate sourcemaps for development', t =>
    bundle({
      root: WORKINGDIR,
      entry: [ 'index.js' ],
      output: path.relative(WORKINGDIR, path.join(TESTDIR, '[name].bundle.0.js')),
      quiet: true,
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'index.bundle.0.js.map')))
    .then(() => t.fail('sourcemap shouldn\'t exist'))
    .catch(e => {
      t.deepEqual(e.code, 'ENOENT', 'sourcemap shouldn\'t exist');
    })
);

test('should bundle for production', t =>
    bundle({
      root: WORKINGDIR,
      entry: [ 'index.js' ],
      output: path.relative(WORKINGDIR, path.join(TESTDIR, '[name].bundle.min.js')),
      production: true,
      sourcemaps: true,
      quiet: true,
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'index.bundle.min.js')))
    .then(data => {
      t.true(data.indexOf('import React from') === -1, 'should be transpiled');
      t.true(data.indexOf('Minified exception occurred;') > -1, 'should be minified');
      t.true(data.indexOf('!function(e){function t(r){if(n[r])return n[r].e') > -1, 'should be minified');
      t.true(data.indexOf('//# sourceMappingURL=index.bundle.min.js.map') > -1, 'should have sourcemap');
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'index.bundle.min.js.map')))
    .then(data => {
      t.true(data.indexOf('"webpack:///../~/react/lib/ReactElement.js"') > -1, 'should have sourcemap');
    })
);

test('should not generate sourcemaps for production', t =>
    bundle({
      root: WORKINGDIR,
      entry: [ 'index.js' ],
      output: path.relative(WORKINGDIR, path.join(TESTDIR, '[name].bundle.0.min.js')),
      production: true,
      quiet: true,
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'index.bundle.0.min.js.map')))
    .then(() => t.fail('sourcemap shouldn\'t exist'))
    .catch(e => {
      t.deepEqual(e.code, 'ENOENT', 'sourcemap shouldn\'t exist');
    })
);
