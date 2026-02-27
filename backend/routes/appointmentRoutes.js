const express = require('express');
const router = express.Router();
const { getAppointments, getQueue, bookAppointment, updateStatus, checkIn, cancelAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);
router.get('/', getAppointments);
router.get('/queue', getQueue);
router.post('/', bookAppointment);
router.put('/:id/status', authorize('admin', 'doctor', 'receptionist'), updateStatus);
router.put('/:id/checkin', authorize('admin', 'receptionist'), checkIn);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
