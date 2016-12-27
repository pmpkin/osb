#!/usr/bin/env node
import program from 'commander';

program
    .version(require('../package.json').version)
    .command('upload [path]', 'Upload a file or contents of a directory to object storage')
    .parse(process.argv);
