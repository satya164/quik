import http from 'http';
import path from 'path';
import server from '../src/server';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

it('should start server', done => {
  const s = server({
    root: path.join(__dirname, '../template'),
  }).listen(3000);

  http.get('http://localhost:3000/', res => {
    s.close();
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type'].toLowerCase()).toEqual(
      'text/html; charset=utf-8'
    );
    done();
  });
});

it('should respond with transpiled script', done => {
  const s = server({
    root: path.join(__dirname, '../template'),
  }).listen(3001);

  http.get('http://localhost:3001/index.js', res => {
    let data = '';

    res.on('data', chunk => (data += chunk));
    res.on('end', () => {
      s.close();
      expect(data).not.toMatch('import React from');
      expect(data).toMatch('function _interopRequireDefault');
      expect(data).toMatch('/******/ (function(modules) { // webpackBootstrap');
      expect(data).toMatch(
        '//# sourceMappingURL=data:application/json;charset=utf-8;base64'
      );
      done();
    });

    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toEqual(
      'application/javascript; charset=utf-8'
    );
  });
});

it('should respond with formatted error', done => {
  const s = server({
    root: path.join(__dirname, '../template'),
  }).listen(3002);

  http.get('http://localhost:3002/none.js', res => {
    let data = '';

    res.on('data', chunk => (data += chunk));
    res.on('end', () => {
      s.close();
      expect(data).toMatch('/* show error response on build fail */');
      done();
    });
  });
});
