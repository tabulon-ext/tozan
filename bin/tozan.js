#!/usr/bin/env node

/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const fs = require('fs'),
  path = require('path');

const optionator = require('optionator');

const tozan = require('../index');

let pkg;

try {
  const packageJson = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8');

  pkg = JSON.parse(packageJson);
}
catch (error) {
  console.error('Could not read/parse "package.json", quite strange...');
  console.error(error);
  process.exit(1);
}

const optsParser = optionator({
  prepend: `${pkg.name} [options] <directory>`,
  append: `Version ${pkg.version}`,
  options: [
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'Help and usage instructions'
    },
    {
      option: 'version',
      alias: 'V',
      type: 'Boolean',
      description: 'Version number',
      example: '-V'
    },
    {
      option: 'verbose',
      alias: 'v',
      type: 'Boolean',
      description: 'Verbose output, will print more information of the process'
    },
    {
      option: 'database',
      alias: 'D',
      type: 'String',
      default: tozan.DEFAULT_DATABASE,
      description: 'SQLite database to use'
    },
    {
      option: 'ignore-dot-files',
      alias: 'i',
      type: 'Boolean',
      description: 'Ignore files and directories that begin with a dot'
    }
  ]
});

let opts;

try {
  opts = optsParser.parse(process.argv);
}
catch (error) {
  console.error(error.message);
  console.log(optsParser.generateHelp());
  process.exit(1);
}

if (opts.version) {
  console.log(pkg.version);
  process.exit(0);
}

if (opts.help) {
  console.log(optsParser.generateHelp());
  process.exit(0);
}

if (opts._.length !== 1) {
  console.error('Directory was not specified');
  console.log(optsParser.generateHelp());
  process.exit(1);
}

const directory = path.resolve(opts._[0]);

try {
  fs.accessSync(directory);
}
catch (error) {
  console.error(`Directory (${directory}) does not exist`);
  process.exit(1);
}

// Fire away
tozan(directory, {
  verbose: typeof opts.verbose === 'boolean' ?
    opts.verbose :
    false,
  ignoreDotFiles: typeof opts.ignoreDotFiles === 'boolean' ?
    opts.ignoreDotFiles :
    false,
  database: typeof opts.database === 'string' ?
    opts.database :
    null
});
