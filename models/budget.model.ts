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

export const Budget = mongoose.model('Budget', budgetSchema);
