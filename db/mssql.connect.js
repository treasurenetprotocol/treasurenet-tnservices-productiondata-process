/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */
const sql = require('mssql');
const config = require('../config').mssql;

const connect = async () => {
    if (config.options.port) {config.options.port = +config.options.port;}
    return await sql.connect(config);
};

module.exports = {connect};
