import Promise from 'bluebird';
import request from 'request';
import fs from 'fs';
const ProgressBar = require('progress');

export default (storage, container, filename, ttl) => {
    return new Promise((resolve, reject) => {
        const filepath = container ? `${container}/${filename}` : `${filename}`;
        const objectPath = `${storage.path}/${filepath}`;
        const stat =  fs.statSync(filename);

        const headers = {
            'Content-Length': stat.size,
            "X-Auth-Token": storage.token
        };
        if (ttl) headers['X-Delete-After'] = ttl;

        const file = fs.createReadStream(filename)
        console.log(`Uploading ${filename} to container ${container}...`);
        file.pipe(request.put({ url: objectPath, headers }, function(err, res, body){
                if (res.statusCode === 408) return reject ('The request timed out.')
                if (res.statusCode === 404) return reject ('The provided container does not exist.')
                if(err) return reject(err.message);
                return resolve();
            }));
        });
}
