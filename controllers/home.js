const isLoggedIn = require('../utils/isLoggedIn');
const Expense = require('../models/expense');

async function getHome(req, res) {
    const {loggedIn, username, userId} = await isLoggedIn(req);
    const expenses = await Expense.find({creator: username}).lean();
 
    res.render('home',{
        title: 'Home',
        loggedIn,
        username,
        expenses,
        userId
        
    });
}

module.exports = getHome;