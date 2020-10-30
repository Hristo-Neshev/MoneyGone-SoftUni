const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');

const homeRouter = require('./routes/home');
const userRouter = require('./routes/user');
const expensesRouter = require('./routes/expenses');
const notFound = require('./controllers/404');
const app = express();
require('./config/express')(app);

mongoose.connect(config.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('The app is connected to the database');
});

app.use('/', homeRouter);
app.use('/', userRouter);
app.use('/', expensesRouter);
app.use('*', notFound);

app.listen(config.port, console.log(`Listening on port ${config.port}...`));