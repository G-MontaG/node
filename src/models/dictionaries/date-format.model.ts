import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateFormatSchema = new Schema({
    value: {type: String, required: true, unique: true, index: true},
    label: {type: String, required: true},
});

export interface IDateFormatDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface IDateFormatModel extends mongoose.Model<IDateFormatDocument> {
    findByValue(value: string, cb: () => void);
}

dateFormatSchema.statics.findByValue = (value: string, cb: () => void) => {
    return DateFormat.findOne({ value }, 'value label', cb);
};

export const DateFormat = mongoose.model('Date-Format', dateFormatSchema) as IDateFormatModel;
