/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */
const RecordModel = require("../model/productionDataRecord");
const moment = require("moment");
const ZediModel = require("../model/zediData");
const logModel = require("../model/logs");
const ASSET = require('../dict').ASSETTYPE.GAS;

const _exist = async (location_id, date) => await RecordModel.existOrNot({
    type: ASSET,
    location_id,
    date: +moment(date).format('YYMMDD')
});

const _save = async (location_id, date, amount) => await RecordModel.newRecord({
    type: ASSET,
    location_id,
    date: +moment(date).format('YYMMDD'),
    month: +moment(date).format('YYMM'),
    amount
})

const process = async (location_id, date) => {
    if (await _exist(location_id, date)) {
        return;
    }
    let amount = 0;
    let success = true;
    switch (location_id) {
        case 996986:
            const vdata = await ZediModel.getProductionDataFromZediData({
                sensor: 'Current Gas Accumulation',
                location_id,
                date
            });
            if (!vdata.recordset[0] || !vdata.recordset[0].amount) {
                success = false;
                break;
            }
            amount = +vdata.recordset[0].amount;
            amount = amount.toFixed(4);
            break;
    }
    if (success) {
        await _save(location_id, date, amount);
        await logModel.newLogs({location_id, date});
    }
    return;
}

module.exports = {process}