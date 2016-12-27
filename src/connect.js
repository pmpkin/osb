import Promise from 'bluebird';
import request from 'request';

const endpoints = {
    private: '.objectstorage.service.networklayer.com/auth/v1.0/',
    public: '.objectstorage.softlayer.net/auth/v1.0/'
}

export default (username, password, region, privateNetwork) => {
    console.log('Connecting to object storage, region ', region, '.');
    return new Promise((resolve, reject) => {
        request.get({ url: `https://${region}${privateNetwork ? endpoints.private : endpoints.public}`, headers:{ "X-Auth-Key": password, "X-Auth-User": username }}, (err, res) => {

            if (err) {
                return reject(err.message);
            }
            if (res.statusCode === 401) return reject('Invalid credentials');
            const data = JSON.parse(res.body);
            return resolve({
                path: privateNetwork ? data.storage.private : data.storage.public,
                token: res.headers['x-auth-token']
            });
        })
    });
}
