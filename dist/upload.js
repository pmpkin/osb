'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProgressBar = require('progress');

exports.default = function (storage, container, filename, ttl) {
    return new _bluebird2.default(function (resolve, reject) {
        var filepath = container ? container + '/' + filename : '' + filename;
        var objectPath = storage.path + '/' + filepath;
        var stat = _fs2.default.statSync(filename);

        var headers = {
            'Content-Length': stat.size,
            "X-Auth-Token": storage.token
        };
        if (ttl) headers['X-Delete-After'] = ttl;

        var file = _fs2.default.createReadStream(filename);
        console.log('Uploading ' + filename + ' to container ' + container + '...');
        file.pipe(_request2.default.put({ url: objectPath, headers: headers }, function (err, res, body) {
            if (res.statusCode === 408) return reject('The request timed out.');
            if (res.statusCode === 404) return reject('The provided container does not exist.');
            if (err) return reject(err.message);
            return resolve();
        }));
    });
};