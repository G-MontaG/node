import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languageSchema = new Schema({
    value: {type: String, required: true, unique: true, index: true},
    label: {type: String, required: true},
});

export interface ILanguageDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface ILanguageModel extends mongoose.Model<ILanguageDocument> {
    findByValue(value: string, cb: () => void);
}

languageSchema.statics.findByValue = (value: string, cb: () => void) => {
    return Language.findOne({ value }, 'value label', cb);
};

export const Language = mongoose.model('Language', languageSchema) as ILanguageModel;
