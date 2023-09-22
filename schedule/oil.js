/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */

const helper = require('./oil.helper');
const logModel = require('../model/logs');

const Process = async (date) => {
    try {
        const array = [996986];
        for (let i = 0; i < array.length; i++) {
            await helper.process(array[i], date);
        }
    } catch (e) {
        console.dir(e);
        await logModel.newLogs(e);
    }

}

module.exports = Process;
