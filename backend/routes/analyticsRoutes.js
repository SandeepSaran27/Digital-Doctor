const express = require('express');
const router = express.Router();
const {
    getDashboard,
    getAppointmentTrends,
    getDiseaseStats,
    getEmergencyStats,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect, authorize('admin', 'doctor'));

// Today's summary stats
router.get('/daily', getDashboard);

// Appointment counts over a date range
router.get('/appointments/trends', getAppointmentTrends);

// Most common diagnoses / disease distribution
router.get('/diseases', getDiseaseStats);

// Emergency statistics
router.get('/emergency', getEmergencyStats);

module.exports = router;
