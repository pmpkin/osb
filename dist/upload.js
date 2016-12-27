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

var upload = function upload(storage, container, sourcePath, filename, ttl) {
    return new _bluebird2.default(function (resolve, reject) {
        var filepath = container ? container + '/' + filename : '' + filename;
        var objectPath = storage.path + '/' + filepath;

        var localFilePath = sourcePath ? sourcePath + '/' + filename : filename;
        var stat = _fs2.default.statSync(localFilePath);

        var headers = {
            'Content-Length': stat.size,
            "X-Auth-Token": storage.token
        };
        var validatedFilePath = filepath;

        if (ttl) headers['X-Delete-After'] = ttl;
        var file = _fs2.default.createReadStream(localFilePath);
        console.log('Uploading ' + filename + ' to container ' + container + '...');
        file.pipe(_request2.default.put({ url: objectPath, headers: headers }, function (err, res, body) {
            if (res.statusCode === 408) return reject('The request timed out.');
            if (res.statusCode === 404) return reject('The provided container does not exist.');
            if (err) return reject(err.message);
            return resolve();
        }));
    });
};

exports.default = function (storage, container, sourcePath, ttl) {
    var stats = _fs2.default.statSync(sourcePath);
    if (stats.isDirectory()) {
        var filenames = _fs2.default.readdirSync(sourcePath);
        return _bluebird2.default.all(filenames.map(function (filename) {
            return upload(storage, container, sourcePath, filename, ttl);
        }));
    }
    return upload(storage, container, '', sourcePath, ttl);
};