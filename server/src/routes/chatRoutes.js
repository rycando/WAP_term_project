const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const { createRoom, listRooms, postMessage, listMessages, upsertAppointment } = require('../controllers/chatController');

const router = express.Router();

router.post('/rooms', ensureAuthenticated, createRoom);
router.get('/rooms', ensureAuthenticated, listRooms);
router.post('/rooms/:id/appointment', ensureAuthenticated, upsertAppointment);
router.post('/messages', ensureAuthenticated, postMessage);
router.get('/messages', ensureAuthenticated, listMessages);

module.exports = router;
