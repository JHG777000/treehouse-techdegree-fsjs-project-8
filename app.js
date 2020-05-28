/************************************************
Treehouse Techdegree:
FSJS project 8 - SQL Library Manager
************************************************/

const express = require('express');
const app = express();

const books = require('./routes/books');

app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));

app.use('/', books);

app.use(function (req, res, next) {
  res.status(404);
  res.render('page-not-found');
});

app.listen(3000, () => {
  console.log('App running on port: "3000"');
});
