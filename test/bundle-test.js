'use strict';

const test = require('ava');
const path = require('path');
const fs = require('fs');
const del = require('del');
const mkdirp = require('mkdirp');
const bundle = require('../src/bundler');
const readFileAsync = require('../src/read-file-async');

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
        quiet: true
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'index.bundle.js')))
    .then(data => {
        t.ok(data.indexOf('import React from') === -1, 'should be transpiled');
        t.ok(data.indexOf('function _interopRequireDefault') > -1, 'should be transpiled');
        t.ok(data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1, 'should not be minified');
        t.ok(data.indexOf('//# sourceMappingURL=index.bundle.js.map') > -1, 'should have sourcemap');
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'index.bundle.js.map')))
    .then(data => {
        t.ok(data.indexOf('"webpack:///./index.js","webpack:///../~/react/react.js"') > -1, 'should have sourcemap');
    })
);

test('should bundle for production', t =>
    bundle({
        root: WORKINGDIR,
        entry: [ 'index.js' ],
        output: path.relative(WORKINGDIR, path.join(TESTDIR, '[name].bundle.min.js')),
        production: true,
        quiet: true
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'index.bundle.min.js')))
    .then(data => {
        t.ok(data.indexOf('import React from') === -1, 'should be transpiled');
        t.ok(data.indexOf('Minified exception occurred;') > -1, 'should be minified');
        t.ok(data.indexOf('!function(e){function t(r){if(n[r])return n[r].exports') > -1, 'should be minified');
        t.ok(data.indexOf('//# sourceMappingURL=index.bundle.min.js.map') > -1, 'should have sourcemap');
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'index.bundle.min.js.map')))
    .then(data => {
        t.ok(data.indexOf('"webpack:///../~/react/lib/ReactMount.js","webpack:///../~/react/lib/ReactElement.js"') > -1, 'should have sourcemap');
    })
);
