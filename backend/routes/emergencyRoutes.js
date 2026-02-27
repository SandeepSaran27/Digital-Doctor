const express = require('express');
const router = express.Router();
const {
    triggerEmergency,
    getEmergencyLogs,
    resolveEmergency,
} = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { audit } = require('../middleware/auditMiddleware');

router.use(protect);

// Trigger emergency alert — any logged-in user (patient, doctor, receptionist)
router.post('/trigger', audit('EMERGENCY_TRIGGERED', 'emergency'), triggerEmergency);

// Get all emergency logs — doctor, admin
router.get('/', authorize('doctor', 'admin'), getEmergencyLogs);

// Mark emergency as resolved
router.put('/:id/resolve', authorize('doctor', 'admin'), audit('EMERGENCY_RESOLVED', 'emergency'), resolveEmergency);

module.exports = router;
