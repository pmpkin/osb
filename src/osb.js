#!/usr/bin/env node
import program from 'commander';
import handleUpload from './osb-upload';

program
    .version(require('../package.json').version)
    .command('upload [path]', 'Upload a file or contents of a directory to object storage')
    .option('-c, --container [container]', 'The target container (required)')
    .option('-n, --network [network]', 'Use public or private network for upload (defaults to public)', 'public')
    .option('-p, --password [password]', 'Your password (API key, required)')
    .option('-r, --region [region]', 'The region, for example fra02 (required)')
    .option('-t, --ttl [ttl]', 'The time to live of the uploaded file (in seconds, optional)')
    .option('-u, --user [user]', 'Your username (required)')
    .action((cmd, env) => handleUpload(env, program));

program.parse(process.argv);

if (!program.args.length) {
    program.outputHelp()
}
