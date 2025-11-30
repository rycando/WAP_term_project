import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchByIsbn,
} from '../controllers/bookController';
import { ensureAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
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

export default router;
