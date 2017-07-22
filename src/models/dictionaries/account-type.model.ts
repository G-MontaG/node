import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountTypeSchema = new Schema({
    value: {type: String, required: true, unique: true, index: true},
    label: {type: String, required: true},
});

export interface IAccountTypeDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface IAccountTypeModel extends mongoose.Model<IAccountTypeDocument> {
    findByValue(value: string, cb: () => void);
}

accountTypeSchema.statics.findByValue = (value: string, cb: () => void) => {
    return AccountType.findOne({ value }, 'value label', cb);
};

export const AccountType = mongoose.model('Account-Type', accountTypeSchema) as IAccountTypeModel;
