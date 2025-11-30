import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/authMiddleware';
import { createRoom, listRooms, postMessage, listMessages } from '../controllers/chatController';

const router = Router();

router.post('/rooms', ensureAuthenticated, createRoom);
router.get('/rooms', ensureAuthenticated, listRooms);
router.post('/messages', ensureAuthenticated, postMessage);
router.get('/messages', ensureAuthenticated, listMessages);

export default router;
