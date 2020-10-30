const router = require('express').Router();
const expenseController = require('../controllers/expenses');


 router.get('/createExpense', expenseController.getCreateExpense);
 router.get('/report/:id', expenseController.getReport);
 router.get('/delete/:id', expenseController.deleteReport);
// router.get('/joinTrip/:id', expenseController.getJoinTrip);
 router.post('/createExpense', expenseController.postCreateExpense);


 module.exports = router;