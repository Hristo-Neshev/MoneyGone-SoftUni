const Expense = require('../models/expense');
const isLoggedIn = require('../utils/isLoggedIn');
const User = require('../models/user');


async function getCreateExpense(req, res) {
    const loggedIn = await isLoggedIn(req);
    if (!loggedIn.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('create', {
        loggedIn: loggedIn.loggedIn,
        username: loggedIn.username,
        title: 'Create Expense',
        userId: loggedIn.userId
        
    })
}

async function postCreateExpense(req, res) {

    const loggedIn = await isLoggedIn(req);
    if (!loggedIn.loggedIn) {
        res.redirect('/');
        return;
    }

    let { merchant, total, category, description, report } = req.body;
    if (report == 'on') {
        report = true;
    } else {
        report = false
    }

    if (merchant.length < 4) {
        res.render('create', {
            loggedIn: loggedIn,
            username: loggedIn.username,
            errorMessage: 'Merchant must be at least 4 characters long!'
        });
        return;
    }
    if (!total.match(/[0-9]+.[0-9]{0,2}/)) {
        res.render('create', {
            loggedIn: loggedIn,
            username: loggedIn.username,
            errorMessage: 'Total must be a number !'
        });
        return;
    }
    if (total < 1) {
        res.render('create', {
            loggedIn: loggedIn,
            username: loggedIn.username,
            errorMessage: 'Total must be a positive number !'
        });
        return;
    }
    if (!category) {
        res.render('create', {
            loggedIn: loggedIn,
            username: loggedIn.username,
            errorMessage: 'You must select category !'
        });
        return;
    }
    if (description.length < 10 || description.length > 50) {
        res.render('create', {
            loggedIn: loggedIn,
            username: loggedIn.username,
            errorMessage: 'Description must be between 10 and 50 characters long !'
        });
        return;
    }
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;


    const newExpense = new Expense({ merchant, total: Number(total).toFixed(2), category, description, report, creator: loggedIn.username, date: today });
    let user = await User.findOne({_id: loggedIn.userId}).lean();
    user.merchants += 1;
    user.amount -= total;
    user.expenses +=  Number(total);
    
    await User.findOneAndUpdate({_id: loggedIn.userId}, user);


    try {
        newExpense.save();
        res.redirect('/');
    } catch (e) {
        console.log(e);
    }


}

async function getReport(req, res) {
    const loggedIn = await isLoggedIn(req);
    if (!loggedIn.loggedIn) {
        res.redirect('/');
        return;
    }

    const expense = await Expense.findOne({ _id: req.params.id }).lean();
   

    res.render('report', {
        title: 'Report',
        loggedIn: loggedIn.loggedIn,
        username: loggedIn.username,
        ...expense,
        
    })

}

async function deleteReport(req, res) {
    try {
        await Expense.findOneAndDelete({ _id: req.params.id });
        res.redirect('/');
    } catch(e) {
        console.log(e);
    }

}



module.exports = { getCreateExpense, postCreateExpense, getReport, deleteReport }