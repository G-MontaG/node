import crypto = require('crypto');
import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true, index: true},
    name: {type: String, required: true},
    currency: {type: String, required: true, default: '1'},
    number_format: {type: String, required: true, default: '1'},
    currency_placement: {type: String, required: true, default: '2'},
    date_format: {type: String, required: true, default: '1'},
});

export interface IBudgetDocument extends mongoose.Document {
    value: string;
    label: string;
}

export interface IBudgetModel extends mongoose.Model<IBudgetDocument> {
    findByUserId(userId: string, cb: () => void);
}

budgetSchema.statics.findByUserId = (userId: string, cb: () => void) => {
    return Budget.find({ user_id: userId }, cb);
};

export const Budget = mongoose.model('Budget', budgetSchema) as IBudgetModel;
