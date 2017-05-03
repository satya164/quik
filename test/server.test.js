'use strict';

import test from 'ava';
import http from 'http';
import path from 'path';
import server from '../dist/server';

test.cb('should start server', t => {
  const s = server({
    root: path.join(__dirname, '../template'),
  }).listen(3000);

  http.get('http://localhost:3000/', res => {
    s.close();
    t.deepEqual(res.statusCode, 200);
    t.deepEqual(res.headers['content-type'], 'text/html; charset=utf-8');
    t.end();
  });
});

test.cb('should respond with transpiled script', t => {
  const s = server({
    root: path.join(__dirname, '../template'),
  }).listen(3001);

  http.get('http://localhost:3001/index.js', res => {
    let data = '';

    res.on('data', chunk => (data += chunk));
    res.on('end', () => {
      s.close();
      t.true(data.indexOf('import React from') === -1, 'should be transpiled');
      t.true(
        data.indexOf('function _interopRequireDefault') > -1,
        'should be transpiled',
      );
      t.true(
        data.indexOf('/******/ (function(modules) { // webpackBootstrap') > -1,
        'should be processed by webpack',
      );
      t.true(
        data.indexOf(
          '//# sourceMappingURL=data:application/json;charset=utf-8;base64',
        ) > -1,
        'should have sourcemap',
      );
      t.end();
    });

    t.deepEqual(res.statusCode, 200);
    t.deepEqual(
      res.headers['content-type'],
      'application/javascript; charset=utf-8',
    );
  });
});

test.cb('should respond with formatted error', t => {
  const s = server({
    root: path.join(__dirname, '../template'),
  }).listen(3002);

  http.get('http://localhost:3002/none.js', res => {
    let data = '';

    res.on('data', chunk => (data += chunk));
    res.on('end', () => {
      s.close();
      t.true(
        data.indexOf('/* show error response on build fail */') > -1,
        'should contain error',
      );
      t.end();
    });
  });
});
