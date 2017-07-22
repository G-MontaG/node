import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    value: {type: String, required: true, unique: true, index: true},
    label: {type: String, required: true},
});

export interface ICategoryDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface ICategoryModel extends mongoose.Model<ICategoryDocument> {
    findByValue(value: string, cb: () => void);
}

categorySchema.statics.findByValue = (value: string, cb: () => void) => {
    return Category.findOne({ value }, 'value label', cb);
};

export const Category = mongoose.model('Category', categorySchema) as ICategoryModel;
