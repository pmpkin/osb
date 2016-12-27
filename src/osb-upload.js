#!/usr/bin/env node
import subCommand from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import request from 'request';
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

subCommand
    .option('-c, --container [container]', 'The target container (required)')
    .option('-p, --password [password]', 'Your password (API key, required)')
    .option('-r, --region [region]', 'The region, for example fra02 (required)')
    .option('-t, --ttl [ttl]', 'The time to live of the uploaded file (in seconds, optional)')
    .option('-u, --user [user]', 'Your username (required)')
    .option('-n, --network [network]', 'Use public or private network for upload (defaults to public)', 'public')
    .action(sourcePath => {
        validatePathExists(sourcePath)
        validateArguments(sourcePath, subCommand);
        uploadFile(sourcePath, subCommand.region, subCommand.container, subCommand.user, subCommand.password, subCommand.ttl, subCommand.network);

    });

subCommand.parse(process.argv);
