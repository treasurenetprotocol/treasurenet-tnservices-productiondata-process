/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */

const helper = require('./gas.helper');
const logModel = require('../model/logs');

const Process = async (date) => {
    try {
        //const array = [996986, 1000225, 1000286, 1001267, 1007764, 1007986, 1008545, 1035344, 1049847, 1049848];
        //const array = [996986,1007986,1001267,1007764,1008545];
        const array = [1007986]
        for (let i = 0; i < array.length; i++) {
            await helper.process(array[i], date);
        }
    } catch (e) {
        console.dir(e);
        await logModel.newLogs(e);
    }

}

module.exports = Process;
