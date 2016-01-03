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
    });
});
