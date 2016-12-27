import Promise from 'bluebird';
import request from 'request';
import fs from 'fs';
const ProgressBar = require('progress');


const upload = (storage, container, sourcePath, filename, ttl) => {
    return new Promise((resolve, reject) => {
        const filepath = container ? `${container}/${filename}` : `${filename}`;
        const objectPath = `${storage.path}/${filepath}`;

        const localFilePath = sourcePath ? `${sourcePath}/filename` : filename;
        const stat =  fs.statSync(localFilePath);

        const headers = {
            'Content-Length': stat.size,
            "X-Auth-Token": storage.token
        };
        let validatedFilePath = filepath;

        if (ttl) headers['X-Delete-After'] = ttl;
        const file = fs.createReadStream(localFilePath)
        console.log(`Uploading ${filename} to container ${container}...`);
        file.pipe(request.put({ url: objectPath, headers }, function(err, res, body){
                if (res.statusCode === 408) return reject ('The request timed out.')
                if (res.statusCode === 404) return reject ('The provided container does not exist.')
                if(err) return reject(err.message);
                return resolve();
            }));
        });
}

export default (storage, container, sourcePath, ttl) => {
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
        const filenames = fs.readdirSync(sourcePath)
        return Promise.all(filenames.map(filename => {
            return upload(storage, container, sourcePath, filename, ttl);
        }));
    }
    return upload(storage, container, '', sourcePath, ttl);
}
