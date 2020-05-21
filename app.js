/************************************************
Treehouse Techdegree:
FSJS project 8 - SQL Library Manager
************************************************/

const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.use('/static',express.static('public'));

app.get('/',(req,res) => {
    res.render('index');
});

app.get('/book/:id',(req,res,next) => {
   
});

app.use((req,res,next) => {
    const err =  new Error('The page you requested, can not be found.');
    err.status = 404;
    console.log(err.status + ': The page you requested, can not be found.');
    next(err);
});

app.use((err,req,res,next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
});

app.listen(3000, () => {
    console.log('App running on port: "3000"');
});