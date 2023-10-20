/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */
const mongoose = require('../db/mongodb.connect');

const LogsSchema = new mongoose.Schema({
    content: Object,
    timestamp: {type: Date, default: Date.now},
});

const logsModel = mongoose.model('productiondatarecord_logs', LogsSchema);

const newLogs = async (content) => {
    let newLogsEntity = new logsModel({content});
    return newLogsEntity.save();
};

module.exports = {newLogs};
