const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  creator: {
        type: 'String',
      
    },
    merchant: {
        type: String,
        required: true
    },
    date: {
        type: String,
       default: Date.now().toString()
    },
    total: {
        type: Number,
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    report: {
        type: Boolean, 
        default: false
    }
  

})


module.exports = mongoose.model('Expense', expenseSchema);

