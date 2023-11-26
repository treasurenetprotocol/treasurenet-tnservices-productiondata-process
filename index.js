/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */
//const schedule = require('node-schedule');
const process = require('./schedule');
const moment = require('moment');
require('./db/mongodb.connect');
require('./db/mssql.connect');

const automaticDataProcess = async () => {
    /*const rule = new schedule.RecurrenceRule();
    rule.hour = [0, 12];
    schedule.scheduleJob(rule, async () => {*/
    /*const date = moment().subtract(2, "days").format('YYYY-MM-DD');
        await process.oilProcess(date);
        await process.gasProcess(date);*/

    const startDate = moment('2023-08-01');
    const endDate = moment('2023-10-05');
    for (let i = 0; startDate<=endDate ; i++) {
        console.log(startDate.format('YYYY-MM-DD'));
        await process.oilProcess(startDate);
        await process.gasProcess(startDate);
        startDate.add(1,'days');
    }
    console.log('END');
    /* })*/
};


automaticDataProcess();
