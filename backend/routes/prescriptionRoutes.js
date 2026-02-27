const express = require('express');
const router = express.Router();
const {
    createPrescription,
    getPrescription,
    getPrescriptions,
    downloadPrescription,
    verifyPrescription,
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { audit } = require('../middleware/auditMiddleware');

// All prescription routes require authentication
router.use(protect);

// Create prescription — doctor only
router.post('/', authorize('doctor', 'admin'), audit('CREATE_PRESCRIPTION', 'prescription'), createPrescription);

// Get single prescription — doctor, patient, admin
router.get('/:id', audit('VIEW_PRESCRIPTION', 'prescription'), getPrescription);

// Get all prescriptions for a patient
router.get('/patient/:patientId', audit('VIEW_PATIENT_PRESCRIPTIONS', 'prescription'), getPrescriptions);

// Download PDF
router.get('/:id/pdf', audit('DOWNLOAD_PRESCRIPTION_PDF', 'prescription'), downloadPrescription);

// Verify via QR hash (public — used by pharmacist scanning)
router.get('/verify/:hash', verifyPrescription);

module.exports = router;
