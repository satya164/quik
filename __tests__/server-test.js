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
        http.get('http://localhost:8000/index.js', res => {
            s.close();
            t.equal(200, res.statusCode);
            t.end();
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
                t.ok(data.indexOf('/* show error response on build fail */') > -1, 'response with error');
                t.end();
            });
        });
    })
    .catch(t.end);
});
