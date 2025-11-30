import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/authMiddleware';
import { listAlerts } from '../controllers/keywordController';

const router = Router();

router.get('/', ensureAuthenticated, listAlerts);

export default router;
