'use strict';

const test = require('blue-tape');
const http = require('http');
const path = require('path');
const server = require('../src/server');

test('should start server', t => {
    server({
        root: path.join(__dirname, '../template'),
        port: 8000
    })
    .then(s => {
        http.get('http://localhost:8000/', res => {
            s.close();
            t.equal(res.statusCode, 200);
            t.equal(res.headers['content-type'], 'text/html; charset=utf-8');
            t.end();
        });
    })
    .catch(t.end);
});

test('should respond with transpiled script', t => {
    server({
        root: path.join(__dirname, '../template'),
        port: 8000
    })
    .then(s => {
        http.get('http://localhost:8000/index.js', res => {
            let data = '';

            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                s.close();
                t.ok(data.indexOf('import React from') === -1, 'should be transpiled');
                t.ok(data.indexOf('function _interopRequireDefault') > -1, 'should be transpiled');
                t.end();
            });

            t.equal(res.statusCode, 200);
            t.equal(res.headers['content-type'], 'application/javascript; charset=utf-8');
        });
    })
    .catch(t.end);
});

test('should respond with formatted error', t => {
    server({
        root: path.join(__dirname, '../template'),
        port: 8000
    })
    .then(s => {
        http.get('http://localhost:8000/none.js', res => {
            let data = '';

            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                s.close();
                t.ok(data.indexOf('/* show error response on build fail */') > -1, 'should contain error');
                t.end();
            });
        });
    })
    .catch(t.end);
});
