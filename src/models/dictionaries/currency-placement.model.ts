import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currencyPlacementSchema = new Schema({
    value: {type: String, required: true, unique: true, index: true},
    label: {type: String, required: true}
});

export interface ICurrencyPlacementDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface ICurrencyPlacementModel extends mongoose.Model<ICurrencyPlacementDocument> {
    findByValue(value: string, cb: () => void);
}

currencyPlacementSchema.statics.findByValue = (value: string, cb: () => void) => {
    return CurrencyPlacement.findOne({value}, 'value label', cb);
};

export const CurrencyPlacement = mongoose.model(
    'CurrencyPlacement',
    currencyPlacementSchema
) as ICurrencyPlacementModel;
