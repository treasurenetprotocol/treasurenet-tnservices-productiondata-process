/**
 * Create with servicePlatform
 * Author: ChrisChiu
 * Date: 2022/4/6
 * Desc
 */

const config = require('../config').mongodb;
const mongoose = require('mongoose');

const DB_URL = config.DB_URL || `mongodb://${config.username}:${config.password}@${config.host}/${config.database}`;

mongoose.connect(DB_URL, {keepAlive: true});

mongoose.connection.on('connected', function () {
    console.info('Mongoose connection open to ' + DB_URL);
});

mongoose.connection.on('error', function (err) {
    console.error('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.info('Mongoose connection disconnected');
});

module.exports = mongoose;
