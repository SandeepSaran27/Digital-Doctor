const express = require('express');
const router = express.Router();

const {
    startSession,
    sendMessage,
    getSession,
    getSessions,
    saveSession,
} = require('../controllers/chatbotController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/session', startSession);
router.post('/session/:sessionId/message', sendMessage);
router.get('/session/:sessionId', getSession);
router.get('/sessions', getSessions);
router.put('/session/:sessionId/end', saveSession);

module.exports = router;