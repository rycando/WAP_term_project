const express = require('express');
const multer = require('multer');
const {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchByIsbn,
} = require('../controllers/bookController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const { uploadsDir } = require('../config/paths');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/', listBooks);
router.get('/isbn/:isbn', searchByIsbn);
router.get('/:id', getBook);
router.post('/', ensureAuthenticated, upload.array('images'), createBook);
router.put('/:id', ensureAuthenticated, upload.array('images'), updateBook);
router.delete('/:id', ensureAuthenticated, deleteBook);

module.exports = router;
