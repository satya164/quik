'use strict';

import test from 'ava';
import path from 'path';
import fs from 'fs';
import EventSource from 'eventsource';
import server from '../src/server';

test.cb('should rebuild on changes', t => {
  const SYNC = 'sync';
  const BUILDING = 'building';
  const BUILT = 'built';
  const HEARTBEAT = '💓';

  const s = server({
    root: path.join(__dirname, '../template'),
    watch: ['./index.js'],
  }).listen(3005);

  const componentFile = path.join(__dirname, '../template', 'MyComponent.js');

  function change(from, to) {
    fs.readFile(componentFile, 'utf-8', (err, res) => {
      if (err) {
        t.end(err);
      } else {
        fs.writeFile(
          componentFile,
          res.toString().replace(from, to),
          'utf-8',
          e => {
            if (e) {
              t.end(e);
            }
          }
        );
      }
    });
  }

  t.plan(15);

  const hmr = new EventSource('http://localhost:3005/__webpack_hmr');

  hmr.onopen = message => {
    t.deepEqual(message.type, 'open', 'should open connection');

    setTimeout(() => change('Hello world!', 'Hello world :D'), 1000);
    setTimeout(() => change('Hello world', 'Hola world'), 5000);
    setTimeout(() => change('Hola world :D', 'Hello world!'), 7000);
  };

  let i = 0;
  let action = SYNC;

  hmr.onmessage = message => {
    const data = message.data;

    if (i === 7) {
      t.deepEqual(data, HEARTBEAT, 'should recieve heartbeat');

      hmr.close();
      s.close();
      t.end();
    }

    if (data === HEARTBEAT) {
      return;
    }

    try {
      const parsed = JSON.parse(data);

      t.deepEqual(parsed.action, action);

      if (parsed.action === BUILT) {
        t.deepEqual(parsed.errors, []);
        t.deepEqual(parsed.warnings, []);
      }

      switch (parsed.action) {
        case SYNC:
          action = BUILDING;
          break;
        case BUILDING:
          action = BUILT;
          break;
        case BUILT:
          action = BUILDING;
          break;
      }

      i++;
    } catch (err) {
      t.end(err);
    }
  };
});
