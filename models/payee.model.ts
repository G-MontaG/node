import crypto = require('crypto');
import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payeeSchema = new Schema({
    value: {type: String, required: true, unique: true, index: true},
    label: {type: String, required: true},
});

export interface IPayeeDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface IPayeeModel extends mongoose.Model<IPayeeDocument> {
    findByValue(value: string, cb: () => void);
}

payeeSchema.statics.findByValue = (value: string, cb: () => void) => {
    return Payee.findOne({ value }, 'value label', cb);
};

export const Payee = mongoose.model('Payee', payeeSchema) as IPayeeModel;
