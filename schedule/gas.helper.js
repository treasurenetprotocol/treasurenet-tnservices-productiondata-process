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
const BigNumber = require("bignumber.js");

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

const _getleftgas = async (location_id, date) => {
    if (location_id === 1049847){
        location_id = 1049844
    }else if(location_id === 1049848){
        location_id = 1049846
    }
    const lgdata = await ZediModel.getProductionDataFromZediData({
        sensor: 'Volume',
        location_id,
        date
    })
    //console.log("location_id:",location_id,"lgdata:",lgdata)
    return BigNumber(+lgdata.recordset[0].amount);
}

const process = async (location_id, date) => {
    if (await _exist(location_id, date)) {
        return;
    }
    const uniqueId = wellinfo.uniqueId[location_id][+ASSET];
    let amount = 0;
    let vdata;
    switch (location_id) {
        case 996986:
            vdata = await ZediModel.getProductionDataFromZediData({
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
        case 1000225:
        case 1000286:
        case 1001267:
        case 1007764:
        case 1035344:
            vdata = await ZediModel.getProductionDataFromZediData({
                sensor: 'Volume',
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
        case 1007986:
        case 1008545:
            vdata = await ZediModel.getProductionDataFromZediData({
                sensor: 'Today_s Volume',
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
        case 1049847:
        case 1049848:
            vdata = await ZediModel.getProductionDataFromZediData({
                sensor: 'Volume',
                location_id,
                date
            });
            if (!vdata.recordset[0] || !vdata.recordset[0].amount) {
                amount = 0;
                break;
            }
            amount = BigNumber(+vdata.recordset[0].amount).minus(await _getleftgas(location_id, date));
            amount = amount.toFixed(4);
            break;
    }
    console.log(location_id,date,amount)
    await _save(location_id, date, amount, uniqueId);
    await logModel.newLogs({location_id, date});
    return;
}

module.exports = {process}
