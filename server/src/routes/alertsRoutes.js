const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const { listAlerts } = require('../controllers/keywordController');

const router = express.Router();

router.get('/', ensureAuthenticated, listAlerts);

module.exports = router;
