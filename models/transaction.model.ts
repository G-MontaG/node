import crypto = require('crypto');
import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    account_id: {type: Schema.Types.ObjectId, required: true, index: true},
    label: {type: String},
    date: {type: Date, required: true},
    payee: {type: String},
    category: {type: String},
    memo: {type: String},
    outflow: {type: Number},
    inflow: {type: Number}
});

export interface ITransactionDocument extends mongoose.Document {
    account_id: string;
    label: string;
    date: Date;
    payee: string;
    category: string;
    memo: string;
    outflow: string;
    inflow: string;
}

export interface ITransactionModel extends mongoose.Model<ITransactionDocument> {
    findByAccountId(accountId: string, cb: () => void);
}

transactionSchema.statics.findByAccountId = (accountId: string, cb: () => void) => {
    return Transaction.find({ account_id: accountId }, cb);
};

export const Transaction = mongoose.model('Transaction', transactionSchema) as ITransactionModel;
