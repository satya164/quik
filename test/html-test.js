'use strict';

const test = require('ava');
const path = require('path');
const fs = require('fs');
const del = require('del');
const mkdirp = require('mkdirp');
const html = require('../src/html');
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

test('should build html for development', t =>
    html({
        root: WORKINGDIR,
        entry: 'index.html',
        output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.html')),
        quiet: true
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.html')))
    .then(data => {
        t.ok(data.indexOf('<!DOCTYPE html>') > -1, 'should have doctype');
        t.ok(data.indexOf('import React from') === -1, 'should be transpiled');
        t.ok(data.indexOf('function _interopRequireDefault') > -1, 'should be transpiled');
        t.ok(data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1, 'should not be minified');
        t.ok(data.indexOf('//# sourceMappingURL=data:application/json;base64') > -1, 'should have sourcemap');
    })
);

test('should build html for production', t =>
    html({
        root: WORKINGDIR,
        entry: 'index.html',
        output: path.relative(WORKINGDIR, path.join(TESTDIR, 'output.min.html')),
        production: true,
        quiet: true
    })
    .then(() => readFileAsync(fs, path.join(TESTDIR, 'output.min.html')))
    .then(data => {
        t.ok(data.indexOf('<!DOCTYPE html>') > -1, 'should have doctype');
        t.ok(data.indexOf('import React from') === -1, 'should be transpiled');
        t.ok(data.indexOf('Minified exception occurred;') > -1, 'should be minified');
        t.ok(data.indexOf('!function(e){function t(r){if(n[r])return n[r].exports') > -1, 'should be minified');
        t.ok(data.indexOf('//# sourceMappingURL=data:application/json;base64') > -1, 'should have sourcemap');
    })
);
