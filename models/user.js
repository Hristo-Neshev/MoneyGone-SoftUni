const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    expenses: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    merchants: {
        type: Number,
        default: 0
    }
})


module.exports = mongoose.model('User', userSchema);