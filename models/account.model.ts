import crypto = require('crypto');
import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    budget_id: {type: Schema.Types.ObjectId, required: true, index: true},
    name: {type: String, required: true},
    type: {type: String, required: true, default: '1'},
    balance: {type: Number, required: true, default: 0},
});

export interface IAccountDocument extends mongoose.Document {
    budget_id: string;
    name: string;
    type: string;
    balance: number;
}

export interface IAccountModel extends mongoose.Model<IAccountDocument> {
    findByBudgetId(userId: string, cb: () => void);
}

accountSchema.statics.findByBudgetId = (budgetId: string, cb: () => void) => {
    return Account.find({ budget_id: budgetId }, cb);
};

export const Account = mongoose.model('Account', accountSchema) as IAccountModel;
