#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs';
import connect from './connect';
import upload from './upload';

const validateArguments = (fileName, { container, user, password, region} ) => {
    const errors = [];
    if (!password) errors.push('Missing password (api key).')
    if (!user) errors.push('Missing username.')
    if (!region) errors.push('Missing region.')
    if (!container) errors.push('Missing target container.')
    if (errors.length > 0) {
        console.log(`\r\nCould not upload file "${fileName}".\r\n`);
        errors.map(error => console.log(`Error: ${error}`));
        process.exit(1);
    }
}

const validatePathExists = (sourcePath) => {
    if (!fs.existsSync(sourcePath)) {
        console.log(`\r\nPath "${sourcePath}" not found.\r\n`);
        process.exit(1);
    }
}

const uploadFile = (sourcePath, region, container = '', username, password, ttl, network) => {

    connect(username, password, region, network)
        .then(storage => upload(storage, container, sourcePath, ttl))
        .then(() => {
            console.log(`Upload successfully finished.`);
            process.exit(0);
        })
        .catch(error => {
            console.log(`Upload failed: `, error);
            process.exit(1);
        })
}

export default (sourcePath, options) => {
    validatePathExists(sourcePath);
    validateArguments(sourcePath, options);
    uploadFile(sourcePath, options.region, options.container, options.user, options.password, options.ttl, options.network);
}
