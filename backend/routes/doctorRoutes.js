const express = require('express');
const router = express.Router();
const {
    getDoctors,
    getDoctorAvailability,
    updateAvailability,
    getDoctorSchedule,
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

// List all active doctors (all roles)
router.get('/', getDoctors);

// Get availability slots for a doctor (for booking calendar)
router.get('/:id/availability', getDoctorAvailability);

// Set / update availability — doctor or admin only
router.put('/:id/availability', authorize('doctor', 'admin'), updateAvailability);

// Get appointments for a specific doctor
router.get('/:id/appointments', authorize('doctor', 'admin', 'receptionist'), getDoctorSchedule);

module.exports = router;
