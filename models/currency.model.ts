import crypto = require('crypto');
import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currencySchema = new Schema({
    value: {type: String, required: true, unique: true, index: true},
    label: {type: String, required: true},
});

export interface ICurrencyDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface ICurrencyModel extends mongoose.Model<ICurrencyDocument> {
    findByValue(value: string, cb: () => void);
}

currencySchema.statics.findByValue = (value: string, cb: () => void) => {
    return Currency.findOne({ value }, 'value label', cb);
};

export const Currency = mongoose.model('Currency', currencySchema);
