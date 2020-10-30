const express = require('express');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');

module.exports = (app) => {
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.engine('.hbs', handlebars({
        extname: '.hbs'
    }));
    app.set('view engine', '.hbs');
    app.use(express.static('static'));
}