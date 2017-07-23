import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, index: true},
    budgetId: {type: Schema.Types.ObjectId, required: true, index: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true, default: '1'},
    balance: {type: Number, required: true, default: 0},
    bankConnection: {type: Object, default: {}}
});

export interface IAccountDocument extends mongoose.Document {
    budget_id: string;
    name: string;
    description: string;
    type: string;
    balance: number;
    bank_connection: object;
}

export interface IAccountModel extends mongoose.Model<IAccountDocument> {
    findByBudgetId(budgetId: string, cb: () => void);
}

accountSchema.statics.findByBudgetId = (budgetId: string, cb: () => void) => {
    return Account.find({ budget_id: budgetId }, cb);
};

export const Account = mongoose.model('Account', accountSchema) as IAccountModel;
