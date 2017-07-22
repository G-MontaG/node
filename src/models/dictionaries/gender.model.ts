import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genderSchema = new Schema({
    value: {type: String, required: true, unique: true, index: true},
    label: {type: String, required: true},
});

export interface IGenderDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface IGenderModel extends mongoose.Model<IGenderDocument> {
    findByValue(value: string, cb: () => void);
}

genderSchema.statics.findByValue = (value: string, cb: () => void) => {
    return Gender.findOne({ value }, 'value label', cb);
};

export const Gender = mongoose.model('Language', genderSchema) as IGenderModel;
