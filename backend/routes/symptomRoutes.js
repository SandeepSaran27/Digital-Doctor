const express = require('express');
const router = express.Router();
const {
    analyzeSymptomRoute,
    getHistory,
    getSymptomList,
} = require('../controllers/symptomController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

// Analyze a set of symptoms (AI-powered)
router.post('/analyze', analyzeSymptomRoute);

// Get symptom analysis history for a patient
router.get('/history', getHistory);
router.get('/history/:patientId', authorize('doctor', 'admin'), getHistory);

// Get list of common/supported symptoms (for frontend selector)
router.get('/common/list', getSymptomList);

module.exports = router;
