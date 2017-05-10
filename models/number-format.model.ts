import crypto = require('crypto');
import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const numberFormatSchema = new Schema({
    value: {type: String, required: true, unique: true, index: true},
    label: {type: String, required: true},
});

export interface INumberFormatDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface INumberFormatModel extends mongoose.Model<INumberFormatDocument> {
    findByValue(value: string, cb: () => void);
}

numberFormatSchema.statics.findByValue = (value: string, cb: () => void) => {
    return NumberFormat.findOne({ value }, 'value label', cb);
};

export const NumberFormat = mongoose.model('NumberFormat', numberFormatSchema) as INumberFormatModel;
