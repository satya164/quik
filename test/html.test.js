'use strict';

import test from 'ava';
import path from 'path';
import fs from 'fs';
import del from 'del';
import mkdirp from 'mkdirp';
import html from '../dist/html';
import readFileAsync from '../dist/read-file-async';

const TESTDIR = '/tmp/quik-test-' + Date.now();
const WORKINGDIR = path.join(__dirname, '../template');

test.before('setup', () =>
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
      }),
  ),
);

test.after('teardown', () => del(TESTDIR, { force: true }));

test('should build html without an entry file', t =>
  html({
    root: WORKINGDIR,
    output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.magic.html')),
    sourcemaps: true,
    quiet: true,
  })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.magic.html')))
    .then(data => {
      t.true(
        data.indexOf('<title>Quik Playground</title>') > -1,
        'should have correct title',
      );
      t.true(data.indexOf('import React from') === -1, 'should be transpiled');
      t.true(
        data.indexOf('function _interopRequireDefault') > -1,
        'should be transpiled',
      );
      t.true(
        data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1,
        'should not be minified',
      );
      t.true(
        data.indexOf(
          '//# sourceMappingURL=data:application/json;charset=utf-8;base64',
        ) > -1,
        'should have sourcemap',
      );
    }));

test('should build html without an entry file when JavaScript file is specified', t =>
  html({
    root: WORKINGDIR,
    output: path.relative(
      WORKINGDIR,
      path.join(TESTDIR, 'output.magic.1.html'),
    ),
    js: 'MyComponent.js',
    sourcemaps: true,
    quiet: true,
  })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.magic.1.html')))
    .then(data => {
      t.true(
        data.indexOf('<title>Quik Playground</title>') > -1,
        'should have correct title',
      );
      t.true(data.indexOf('import React from') === -1, 'should be transpiled');
      t.true(
        data.indexOf('function _interopRequireDefault') > -1,
        'should be transpiled',
      );
      t.true(
        data.indexOf(
          "_reactDom2.default.render(_react2.default.createElement(_MyComponent2.default, null), document.getElementById('root'))",
        ) === -1,
        'should be the correct file',
      );
    }));

test('should build html for development', t =>
  html({
    root: WORKINGDIR,
    entry: 'index.html',
    output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.html')),
    sourcemaps: true,
    quiet: true,
  })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.html')))
    .then(data => {
      t.true(data.indexOf('<!DOCTYPE html>') > -1, 'should have doctype');
      t.true(data.indexOf('import React from') === -1, 'should be transpiled');
      t.true(
        data.indexOf('function _interopRequireDefault') > -1,
        'should be transpiled',
      );
      t.true(
        data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1,
        'should not be minified',
      );
      t.true(
        data.indexOf(
          '//# sourceMappingURL=data:application/json;charset=utf-8;base64',
        ) > -1,
        'should have sourcemap',
      );
    }));

test('should not add sourcemap for development', t =>
  html({
    root: WORKINGDIR,
    entry: 'index.html',
    output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.0.html')),
    quiet: true,
  })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.0.html')))
    .then(data => {
      t.true(
        data.indexOf(
          '//# sourceMappingURL=data:application/json;charset=utf-8;base64',
        ) === -1,
        "shouldn't have sourcemap",
      );
    }));

test('should build html for production', t =>
  html({
    root: WORKINGDIR,
    entry: 'index.html',
    output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.min.html')),
    sourcemaps: true,
    production: true,
    quiet: true,
  })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.min.html')))
    .then(data => {
      t.true(data.indexOf('<!DOCTYPE html>') > -1, 'should have doctype');
      t.true(data.indexOf('import React from') === -1, 'should be transpiled');
      t.true(
        data.indexOf('Minified exception occurred;') > -1,
        'should be minified',
      );
      t.true(
        data.indexOf('!function(e){function t(r){if(n[r])return n[r].e') > -1,
        'should be minified',
      );
      t.true(
        data.indexOf(
          '//# sourceMappingURL=data:application/json;charset=utf-8;base64',
        ) > -1,
        'should have sourcemap',
      );
    }));

test('should not add sourcemap for production', t =>
  html({
    root: WORKINGDIR,
    entry: 'index.html',
    output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.0.min.html')),
    production: true,
    quiet: true,
  })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.0.min.html')))
    .then(data => {
      t.true(
        data.indexOf(
          '//# sourceMappingURL=data:application/json;charset=utf-8;base64',
        ) === -1,
        "shouldn't have sourcemap",
      );
    }));
