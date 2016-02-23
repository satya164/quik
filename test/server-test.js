'use strict';

const test = require('ava');
const http = require('http');
const path = require('path');
const server = require('../src/server');

test.cb('should start server', t => {
    const s = server({
        root: path.join(__dirname, '../template')
    }).listen(3000);

    http.get('http://localhost:3000/', res => {
        s.close();
        t.same(res.statusCode, 200);
        t.same(res.headers['content-type'], 'text/html; charset=utf-8');
        t.end();
    });
});

test.cb('should respond with transpiled script', t => {
    const s = server({
        root: path.join(__dirname, '../template')
    }).listen(3001);

    http.get('http://localhost:3001/index.js', res => {
        let data = '';

        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            s.close();
            t.ok(data.indexOf('import React from') === -1, 'should be transpiled');
            t.ok(data.indexOf('function _interopRequireDefault') > -1, 'should be transpiled');
            t.ok(data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1, 'should be processed by webpack');
            t.ok(data.indexOf('//# sourceMappingURL=data:application/json;charset=utf-8;base64') > -1, 'should have sourcemap');
            t.end();
        });

        t.same(res.statusCode, 200);
        t.same(res.headers['content-type'], 'application/javascript; charset=utf-8');
    });
});

test.cb('should respond with formatted error', t => {
    const s = server({
        root: path.join(__dirname, '../template')
    }).listen(3002);

    http.get('http://localhost:3002/none.js', res => {
        let data = '';

        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            s.close();
            t.ok(data.indexOf('/* show error response on build fail */') > -1, 'should contain error');
            t.end();
        });
    });
});
