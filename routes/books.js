const express = require('express');
const books = express.Router();
const Book = require('../models').models.Book;

//root route
books.get('/', (req, res) => res.redirect('/books'));

//get books - main page list all books
books.get(
  '/books',
 async (req, res) => {
    const books = await Book.findAll({ });
    res.render('index', { books });
  }
);

//new book - create a new book page
books.get('/books/new', (req, res) => {
  res.render('new-book', { book: {} });
});

//new book - post new book back to database
books.post(
  '/books/new',
 async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect('/');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        res.render('new-book', {
          book,
          errors: error.errors,
        });
      } else {
        res.status(500);
        res.render('error');
      }
    }
  }
);

//edit book - edit a book page
books.get(
  '/books/:id',
 async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('book-detail', { book });
    } else {
      res.status(500);
      res.render('error');
    }
  }
);

//edit book - post edited book back to database
books.post(
  '/books/:id',
 async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect('/');
      } else {
        res.status(500);
        res.render('error');
      }
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render('book-detail', {
          book,
          errors: error.errors,
        });
      } else {
        res.status(500);
        res.render('error');
      }
    }
  }
);

// delete a book with id
books.post(
  '/books/:id/delete',
  async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/');
    } else {
      res.status(500);
      res.render('error');
    }
  }
);

module.exports = books;
