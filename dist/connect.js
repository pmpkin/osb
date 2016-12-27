'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var endpoints = {
    private: '.objectstorage.service.networklayer.com/auth/v1.0/',
    public: '.objectstorage.softlayer.net/auth/v1.0/'
};

exports.default = function (username, password, region, privateNetwork) {
    console.log('Connecting to object storage, region ', region, '.');
    return new _bluebird2.default(function (resolve, reject) {
        _request2.default.get({ url: 'https://' + region + (privateNetwork ? endpoints.private : endpoints.public), headers: { "X-Auth-Key": password, "X-Auth-User": username } }, function (err, res) {

            if (err) {
                return reject(err.message);
            }
            if (res.statusCode === 401) return reject('Invalid credentials');
            var data = JSON.parse(res.body);
            return resolve({
                path: privateNetwork ? data.storage.private : data.storage.public,
                token: res.headers['x-auth-token']
            });
        });
    });
};