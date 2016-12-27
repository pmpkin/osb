#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateArguments = function validateArguments(fileName, _ref) {
    var container = _ref.container,
        user = _ref.user,
        password = _ref.password,
        region = _ref.region;

    var errors = [];
    if (!password) errors.push('Missing password (api key).');
    if (!user) errors.push('Missing username.');
    if (!region) errors.push('Missing region.');
    if (!container) errors.push('Missing target container.');
    if (errors.length > 0) {
        console.log('\r\nCould not upload file "' + fileName + '".\r\n');
        errors.map(function (error) {
            return console.log('Error: ' + error);
        });
        process.exit(1);
    }
};

var validatePathExists = function validatePathExists(sourcePath) {
    if (!_fs2.default.existsSync(sourcePath)) {
        console.log('\r\nPath "' + sourcePath + '" not found.\r\n');
        process.exit(1);
    }
};

var uploadFile = function uploadFile(sourcePath, region) {
    var container = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var username = arguments[3];
    var password = arguments[4];
    var ttl = arguments[5];
    var network = arguments[6];


    (0, _connect2.default)(username, password, region, network).then(function (storage) {
        return (0, _upload2.default)(storage, container, sourcePath, ttl);
    }).then(function () {
        console.log('Upload successfully finished.');
        process.exit(0);
    }).catch(function (error) {
        console.log('Upload failed: ', error);
        process.exit(1);
    });
};

_commander2.default.option('-c, --container [container]', 'The target container (required)').option('-p, --password [password]', 'Your password (API key, required)').option('-r, --region [region]', 'The region, for example fra02 (required)').option('-t, --ttl [ttl]', 'The time to live of the uploaded file (in seconds, optional)').option('-u, --user [user]', 'Your username (required)').option('-n, --network [network]', 'Use public or private network for upload (defaults to public)', 'public').action(function (sourcePath) {
    validatePathExists(sourcePath);
    validateArguments(sourcePath, _commander2.default);
    uploadFile(sourcePath, _commander2.default.region, _commander2.default.container, _commander2.default.user, _commander2.default.password, _commander2.default.ttl, _commander2.default.network);
});

_commander2.default.parse(process.argv);