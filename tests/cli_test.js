/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import fs from 'fs';
import path from 'path';
import {
  execFile
} from 'child_process';
import {
  fileURLToPath
} from 'url';

import tape from 'tape';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import pkg from '../package.json' assert { type: 'json' };

tape('cli should output version number', (test) => {
  test.plan(1);

  execFile('node', [pkg.bin, '-V'], null, (error, stdout) => {
    if (error) {
      test.fail(error);
    }
    test.equals(stdout.trim(), pkg.version, 'Version is the same as in package.json');
  });

});

tape('cli should output help by default', (test) => {
  test.plan(2);

  execFile('node', [pkg.bin], null, (error, stdout) => {
    if (error) {
      test.pass('Expected to exit with non zero value');
    }
    test.ok(stdout.trim().indexOf('tozan [options] <directory>') !== -1, 'Help appeared');
  });

});

tape('cli should output help when requested', (test) => {
  test.plan(1);

  execFile('node', [pkg.bin, '--help'], null, (error, stdout) => {
    if (error) {
      test.fail(error);
    }
    test.ok(stdout.trim().indexOf('tozan [options] <directory>') !== -1, 'Help appeared');
  });

});

tape('cli should complain when non existing option used', (test) => {
  test.plan(2);

  execFile('node', [pkg.bin, '-g'], null, (error, stdout, stderr) => {
    if (error) {
      test.pass('Expected to exit with non zero value');
    }
    test.ok(stderr.trim().indexOf('Invalid option ') !== -1, 'Complaint seen');
  });

});

tape('cli should require at least one directory', (test) => {
  test.plan(2);

  execFile('node', [pkg.bin], null, (error, stdout, stderr) => {
    if (error) {
      test.pass('Expected to exit with non zero value');
    }
    test.equal(stderr.trim(), 'Directory was not specified');
  });

});

tape('cli realises that directory does not exist', (test) => {
  test.plan(2);

  execFile('node', [pkg.bin, 'not-here'], null, (error, stdout, stderr) => {
    if (error) {
      test.pass('Expected to exit with non zero value');
    }
    test.ok(stderr.indexOf('not-here" does not exis') !== -1);
  });

});

tape('cli executes when directory exists', (test) => {
  test.plan(1);

  execFile('node', [pkg.bin, __dirname], null, (error, stdout) => {
    if (error) {
      test.fail(error);
    }
    test.equal(stdout.search(/Using\s"(LibreSSL|OpenSSL)/gu), 0);
  });

});
