import mongoose = require('mongoose');

const Schema = mongoose.Schema;
import winston = require('winston');

const languageSchema = new Schema({
    value: {type: String, required: true, unique: true, index: true},
    label: {type: String, required: true}
});

export interface ILanguageDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface ILanguageModel extends mongoose.Model<ILanguageDocument> {
    findByValue(value: string, cb: () => void);
}

languageSchema.statics.findByValue = (value: string, cb: () => void) => {
    return Language.findOne({value}, 'value label', cb);
};

export const Language = mongoose.model('Language', languageSchema) as ILanguageModel;

import json = require('./language-data');

Language.count({}).exec()
    .then((counter) => {
        if (counter === 0) {
            Language.insertMany(json.data).catch((err) => {
                winston.log('error', 'Error during upload language dictionary', err);
            });
        }
    });
