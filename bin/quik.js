#! /usr/bin/env node

var server = require('../index');

server.start(process.argv[2] ? parseInt(process.argv[2], 10) : 3000);
