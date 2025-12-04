const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', (_req, res) => res.render('home'));
router.get('/login', (_req, res) => res.render('login'));
router.get('/register', (_req, res) => res.render('register'));
router.get('/books/new', ensureAuthenticated, (_req, res) => res.render('book-new'));
router.get('/books/:id', (req, res) => res.render('book-detail', { params: req.params }));
router.get('/books/:id/edit', ensureAuthenticated, (req, res) => res.render('book-edit', { params: req.params }));
router.get('/me', ensureAuthenticated, (_req, res) => res.render('mypage'));
router.get('/chat', ensureAuthenticated, (_req, res) => res.render('chat'));
router.get('/keywords', ensureAuthenticated, (_req, res) => res.render('keywords'));

module.exports = router;
