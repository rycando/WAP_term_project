import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/authMiddleware';
import { listKeywords, createKeyword, deleteKeyword } from '../controllers/keywordController';

const router = Router();

router.get('/', ensureAuthenticated, listKeywords);
router.post('/', ensureAuthenticated, createKeyword);
router.delete('/:id', ensureAuthenticated, deleteKeyword);

export default router;
