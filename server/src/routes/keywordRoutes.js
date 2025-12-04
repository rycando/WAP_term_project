const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const { listKeywords, createKeyword, deleteKeyword } = require('../controllers/keywordController');

const router = express.Router();

router.get('/', ensureAuthenticated, listKeywords);
router.post('/', ensureAuthenticated, createKeyword);
router.delete('/:id', ensureAuthenticated, deleteKeyword);

module.exports = router;
