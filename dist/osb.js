#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _osbUpload = require('./osb-upload');

var _osbUpload2 = _interopRequireDefault(_osbUpload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(require('../package.json').version).command('upload [path]', 'Upload a file or contents of a directory to object storage').option('-c, --container [container]', 'The target container (required)').option('-n, --network [network]', 'Use public or private network for upload (defaults to public)', 'public').option('-p, --password [password]', 'Your password (API key, required)').option('-r, --region [region]', 'The region, for example fra02 (required)').option('-t, --ttl [ttl]', 'The time to live of the uploaded file (in seconds, optional)').option('-u, --user [user]', 'Your username (required)').action(function (cmd, env) {
    return (0, _osbUpload2.default)(env, _commander2.default);
});

_commander2.default.parse(process.argv);

if (!_commander2.default.args.length) {
    _commander2.default.outputHelp();
}