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
    flow: { type: {
        value: {type: Number, required: true},
        type: {type: String, required: true}
    }, required: true}
});

export interface ITransactionDocument extends mongoose.Document {
    account_id: string;
    label: string;
    date: Date;
    payee: string;
    category: string;
    memo: string;
    flow: {
        value: number,
        type: string
    };

    setInflow(inflow: number);
    setOutflow(outflow: number);
}

export interface ITransactionModel extends mongoose.Model<ITransactionDocument> {
    findByAccountId(accountId: string, cb: () => void);
}

transactionSchema.statics.findByAccountId = (accountId: string, cb: () => void) => {
    return Transaction.find({ account_id: accountId }, cb);
};

transactionSchema.methods.setInflow = (inflow: number) => {
    this.flow = {
        value: Math.abs(inflow),
        type: 'inflow'
    };
};

transactionSchema.methods.setOutflow = (outflow: number) => {
    this.flow = {
        value: Math.abs(outflow),
        type: 'outflow'
    };
};

export const Transaction = mongoose.model('Transaction', transactionSchema) as ITransactionModel;
