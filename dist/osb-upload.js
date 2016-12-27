#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

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

exports.default = function (sourcePath, options) {
    validatePathExists(sourcePath);
    validateArguments(sourcePath, options);
    uploadFile(sourcePath, options.region, options.container, options.user, options.password, options.ttl, options.network);
};