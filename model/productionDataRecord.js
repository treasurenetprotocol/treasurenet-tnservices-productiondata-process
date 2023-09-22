/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */

const mongoose = require("../db/mongodb.connect");
const dict = require('../dict');

const RecordSchema = new mongoose.Schema({
    location_id: {type: Number, index: true, required: true},
    date: {type: Number, index: true, required: true},
    amount: Number,
    month: Number,
    status: {type: Number, default: dict.STATUS.UNUSED},  // 0:未使用 1：已使用
    timestamp: {type: Date, default: Date.now},
})

const OilDataRecordModel = mongoose.model("ProductionDataRecord_OIL", RecordSchema);
const GasDataRecordModel = mongoose.model("ProductionDataRecord_GAS", RecordSchema);

const getRecord = async ({type = dict.ASSETTYPE.OIL, location_id, date}) => {
    const Model = type === dict.ASSETTYPE.OIL ? OilDataRecordModel : GasDataRecordModel;
    return Model.findOne({location_id, date}).exec()
}

const existOrNot = async ({type = dict.ASSETTYPE.OIL, location_id, date}) => {
    const Model = type === dict.ASSETTYPE.OIL ? OilDataRecordModel : GasDataRecordModel;
    return Model.count({location_id, date});
}

const newRecord = async ({type = dict.ASSETTYPE.OIL, location_id, date, amount, month}) => {
    const Model = type === dict.ASSETTYPE.OIL ? OilDataRecordModel : GasDataRecordModel;
    if (!month) Math.ceil(date / 100);
    const exist = await existOrNot({type, location_id, date, month});
    if (exist) {
        return;
    }
    const newEntity = new Model({location_id, date, amount, month});
    return newEntity.save();
}

module.exports = {getRecord, existOrNot, newRecord}
