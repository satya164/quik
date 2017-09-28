import path from 'path';
import fs from 'fs';
import EventSource from 'eventsource';
import server from '../src/server';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

it('should rebuild on changes', done => {
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
        done.fail(err);
      } else {
        fs.writeFile(
          componentFile,
          res.toString().replace(from, to),
          'utf-8',
          e => {
            if (e) {
              done.fail(e);
            }
          }
        );
      }
    });
  }

  expect.assertions(15);

  const hmr = new EventSource('http://localhost:3005/__webpack_hmr');

  hmr.onopen = message => {
    expect(message.type).toEqual('open');

    setTimeout(() => change('Hello world!', 'Hello world :D'), 1000);
    setTimeout(() => change('Hello world', 'Hola world'), 5000);
    setTimeout(() => change('Hola world :D', 'Hello world!'), 7000);
  };

  let i = 0;
  let action = SYNC;

  hmr.onmessage = message => {
    const data = message.data;

    if (i === 7) {
      expect(data).toEqual(HEARTBEAT);

      hmr.close();
      s.close();
      done();
    }

    if (data === HEARTBEAT) {
      return;
    }

    try {
      const parsed = JSON.parse(data);

      expect(parsed.action).toEqual(action);

      if (parsed.action === BUILT) {
        expect(parsed.errors).toEqual([]);
        expect(parsed.warnings).toEqual([]);
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
      done.fail(err);
    }
  };
});
