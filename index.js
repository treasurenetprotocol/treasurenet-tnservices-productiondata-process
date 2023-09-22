/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */
const schedule = require('node-schedule');
const process = require('./schedule');
const moment = require('moment');
require('./db/mongodb.connect');
require('./db/mssql.connect');

const automaticDataProcess = async () => {
    /*const rule = new schedule.RecurrenceRule();
    rule.hour = [0, 12];
    schedule.scheduleJob(rule, async () => {*/
        const date = moment().subtract(2, "days").format('YYYY-MM-DD');
        await process.oilProcess(date);
        await process.gasProcess(date);

        /* 跑很多天的 */
        /*for (let i = 2; i < 32; i++) {
            const date = moment().subtract(i, "days").format('YYYY-MM-DD');
            await process.oilProcess(date);
            await process.gasProcess(date);
        }*/
   /* })*/
}


automaticDataProcess();
