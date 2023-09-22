/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */

const mssql = require("../db/mssql.connect");
const config = require('../config');
const moment = require('moment');

const getProductionDataFromZediData = async ({sensor,location_id,date}) => {
    const startTimeStr = date;
    const endTimeStr = moment(date).add(1, "days").format("YYYY-MM-DD");
    const query = `SELECT location_id,sensor,amount,starttime FROM ${config.mssql_tableName} WHERE sensor = '${sensor}' AND location_id = '${location_id}' AND starttime between '${startTimeStr}' and '${endTimeStr}' ORDER BY starttime DESC`;
    return _query(query);
}


const _query = async (query) => {
    const handler = await mssql.connect();
    return await handler.query(query);
}


module.exports = {getProductionDataFromZediData};
