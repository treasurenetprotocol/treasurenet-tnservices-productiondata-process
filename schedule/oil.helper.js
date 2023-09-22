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

const _getwatercut = async (date) => {
    const location_id = 996987;

    const wdata = await ZediModel.getProductionDataFromZediData({sensor: 'Current Water Volume', location_id, date});
    const odata = await ZediModel.getProductionDataFromZediData({sensor: 'Current Oil Volume', location_id, date});
    const water = BigNumber(wdata.recordset[0].amount);
    const oil = BigNumber(odata.recordset[0].amount);
    return water.div(water.plus(oil));
}

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
    const watercut = await _getwatercut(date);
    let amount = 0;
    switch (location_id) {
        case 996986:
            const ldata = await ZediModel.getProductionDataFromZediData({
                sensor: 'Current Fluid Accumulation',
                location_id,
                date
            });
            if(!ldata.recordset[0] || !ldata.recordset[0].amount) break;
            const liquid = BigNumber(ldata.recordset[0].amount);
            amount = liquid.minus(liquid.times(watercut)).toFixed(4);  //4位小数
            break;
    }
    await _save(location_id, date, amount);
    return;
}

module.exports = {process}

