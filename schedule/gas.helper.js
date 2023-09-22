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
const wellinfo = require('../config/wellinfo');

const _exist = async (location_id, date) => await RecordModel.existOrNot({
    type: ASSET,
    location_id,
    date: +moment(date).format('YYMMDD')
});

const _save = async (location_id, date, amount, uniqueId) => await RecordModel.newRecord({
    type: ASSET,
    location_id,
    date: +moment(date).format('YYMMDD'),
    month: +moment(date).format('YYMM'),
    amount, uniqueId
})

const process = async (location_id, date) => {
    if (await _exist(location_id, date)) {
        return;
    }
    const uniqueId = wellinfo.uniqueId[location_id][+ASSET];
    let amount = 0;
    switch (location_id) {
        case 996986:
            const vdata = await ZediModel.getProductionDataFromZediData({
                sensor: 'Current Gas Accumulation',
                location_id,
                date
            });
            if (!vdata.recordset[0] || !vdata.recordset[0].amount) {
                amount = 0;
                break;
            }
            amount = +vdata.recordset[0].amount;
            amount = amount.toFixed(4);
            break;
    }
    await _save(location_id, date, amount, uniqueId);
    await logModel.newLogs({location_id, date});
    return;
}

module.exports = {process}
