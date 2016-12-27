#!/usr/bin/env node
import program from 'commander';

program
    .version(require('../package.json').version)
    .command('upload [filename]', 'Upload file to object storage')
    .parse(process.argv);
