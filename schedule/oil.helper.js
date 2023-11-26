/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */
const ZediModel = require('../model/zediData');
const RecordModel = require('../model/productionDataRecord');
const ASSET = require('../dict').ASSETTYPE.OIL;
const moment = require('moment');
const BigNumber = require('bignumber.js');
const logModel = require('../model/logs');
const wellinfo = require('../config/wellinfo');

const _getwatercut = async (date) => {
    const location_id = 996987;
    const wdata = await ZediModel.getProductionDataFromZediData({sensor: 'Current Water Volume', location_id, date});
    const odata = await ZediModel.getProductionDataFromZediData({sensor: 'Current Oil Volume', location_id, date});
    if(!wdata.recordset || !wdata.recordset[0] || !wdata.recordset[0].amount) {return BigNumber(0);}
    const water = BigNumber(wdata.recordset[0].amount);
    const oil = BigNumber(odata.recordset[0].amount);
    return water.div(water.plus(oil));
};

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
});

const process = async (location_id, date) => {
    if (await _exist(location_id, date)) {
        return;
    }
    const uniqueId = wellinfo.uniqueId[location_id][+ASSET];
    const watercut = await _getwatercut(date);
    let amount = 0;
    let ldata;
    let liquid;
    switch (location_id) {
    case 996986:
    case 1000225:
        ldata = await ZediModel.getProductionDataFromZediData({
            sensor: 'Current Fluid Accumulation',
            location_id,
            date
        });
        if (!ldata.recordset[0] || !ldata.recordset[0].amount) {
            amount = 0;
            break;
        }
        liquid = BigNumber(ldata.recordset[0].amount);
        amount = liquid.minus(liquid.times(watercut)).toFixed(4);  
        break;

    case 1000286:
    case 1001267:
        ldata = await ZediModel.getProductionDataFromZediData({
            sensor: 'Current Fluids Accumulations',
            location_id,
            date
        });
        if (!ldata.recordset[0] || !ldata.recordset[0].amount) {
            amount = 0;
            break;
        }
        liquid = BigNumber(ldata.recordset[0].amount);
        amount = liquid.minus(liquid.times(watercut)).toFixed(4);  
        break;
    case 1007764:
        ldata = await ZediModel.getProductionDataFromZediData({
            sensor: 'Total Fluids',
            location_id,
            date
        });
        if (!ldata.recordset[0] || !ldata.recordset[0].amount) {
            amount = 0;
            break;
        }
        liquid = BigNumber(ldata.recordset[0].amount);
        amount = liquid.minus(liquid.times(watercut)).toFixed(4);  
        break;
    case 1007986:
        ldata = await ZediModel.getProductionDataFromZediData({
            sensor: 'Current Oil Volume',
            location_id,
            date
        });
        if (!ldata.recordset[0] || !ldata.recordset[0].amount) {
            amount = 0;
            break;
        }
        liquid = BigNumber(ldata.recordset[0].amount);
        amount = liquid.minus(liquid.times(watercut)).toFixed(4);  
        break;
    case 1008545:
        ldata = await ZediModel.getProductionDataFromZediData({
            sensor: 'Emulsion',
            location_id,
            date
        });
        if (!ldata.recordset[0] || !ldata.recordset[0].amount) {
            amount = 0;
            break;
        }
        liquid = BigNumber(ldata.recordset[0].amount);
        amount = liquid.minus(liquid.times(watercut)).toFixed(4);  
        break;
    case 1035344:
        ldata = await ZediModel.getProductionDataFromZediData({
            sensor: 'Test Separator Liquid Meter',
            location_id,
            date
        });
        if (!ldata.recordset[0] || !ldata.recordset[0].amount) {
            amount = 0;
            break;
        }
        liquid = BigNumber(ldata.recordset[0].amount);
        amount = liquid.minus(liquid.times(watercut)).toFixed(4);  
        break;
    case 1049847:
        ldata = await ZediModel.getProductionDataFromZediData({
            sensor: 'FQIT-1102 D-1100 Oil Meter TDAy',
            location_id,
            date
        });
        if (!ldata.recordset[0] || !ldata.recordset[0].amount) {
            amount = 0;
            break;
        }
        amount = BigNumber(ldata.recordset[0].amount);
        break;
    case 1049848:
        ldata = await ZediModel.getProductionDataFromZediData({
            sensor: 'FQIT-1202 D-1200 Oil METER TDAY',
            location_id,
            date
        });
        if (!ldata.recordset[0] || !ldata.recordset[0].amount) {
            amount = 0;
            break;
        }
        amount = BigNumber(ldata.recordset[0].amount);
        break;
    default:
        return;

    }
    console.log(location_id,date,amount);
    await _save(location_id, date, amount, uniqueId);
    await logModel.newLogs({location_id, date});
    return;
};

module.exports = {process};

