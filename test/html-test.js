'use strict';

const test = require('ava');
const path = require('path');
const fs = require('fs');
const del = require('del');
const mkdirp = require('mkdirp');
const html = require('../dist/html').default;
const readFileAsync = require('../dist/read-file-async').default;

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

test('should build html without an entry file', t =>
    html({
        root: WORKINGDIR,
        output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.magic.html')),
        sourcemaps: true,
        quiet: true
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.magic.html')))
    .then(data => {
        t.truthy(data.indexOf('<title>Quik Playground</title>') > -1, 'should have correct title');
        t.truthy(data.indexOf('import React from') === -1, 'should be transpiled');
        t.truthy(data.indexOf('function _interopRequireDefault') > -1, 'should be transpiled');
        t.truthy(data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1, 'should not be minified');
        t.truthy(data.indexOf('//# sourceMappingURL=data:application/json;charset=utf-8;base64') > -1, 'should have sourcemap');
    })
);

test('should build html for development', t =>
    html({
        root: WORKINGDIR,
        entry: 'index.html',
        output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.html')),
        sourcemaps: true,
        quiet: true
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.html')))
    .then(data => {
        t.truthy(data.indexOf('<!DOCTYPE html>') > -1, 'should have doctype');
        t.truthy(data.indexOf('import React from') === -1, 'should be transpiled');
        t.truthy(data.indexOf('function _interopRequireDefault') > -1, 'should be transpiled');
        t.truthy(data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1, 'should not be minified');
        t.truthy(data.indexOf('//# sourceMappingURL=data:application/json;charset=utf-8;base64') > -1, 'should have sourcemap');
    })
);

test('should build html for production', t =>
    html({
        root: WORKINGDIR,
        entry: 'index.html',
        output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.min.html')),
        sourcemaps: true,
        production: true,
        quiet: true
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.min.html')))
    .then(data => {
        t.truthy(data.indexOf('<!DOCTYPE html>') > -1, 'should have doctype');
        t.truthy(data.indexOf('import React from') === -1, 'should be transpiled');
        t.truthy(data.indexOf('Minified exception occurred;') > -1, 'should be minified');
        t.truthy(data.indexOf('!function(e){function t(r){if(n[r])return n[r].e') > -1, 'should be minified');
        t.truthy(data.indexOf('//# sourceMappingURL=data:application/json;charset=utf-8;base64') > -1, 'should have sourcemap');
    })
);
