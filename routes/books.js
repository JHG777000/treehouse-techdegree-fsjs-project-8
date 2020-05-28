const express = require('express');
const books = express.Router();
const Book = require('../models').models.Book;

//base error handler
const base_error_handler = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
};

//root route
books.get('/', (req, res) => res.redirect('/books'));

//get books
books.get(
  '/books',
  base_error_handler(async (req, res) => {
    const books = await Book.findAll({ order: [['createdAt', 'DESC']] });
    res.render('index', { books });
  })
);

//new book
books.get('/books/new', (req, res) => {
  res.render('new-book', { book: {} });
});

//new book
books.post(
  '/books/new',
  base_error_handler(async (req, res) => {
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
        throw error;
      }
    }
  })
);

//edit book
books.get(
  '/books/:id',
  base_error_handler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('book-detail', { book });
    } else {
      res.sendStatus(404);
    }
  })
);

//edit book
books.post(
  '/books/:id',
  base_error_handler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect('/');
      } else {
        res.sendStatus(404);
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
        throw error;
      }
    }
  })
);

// delete a book with id
books.post(
  '/books/:id/delete',
  base_error_handler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/');
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = books;
