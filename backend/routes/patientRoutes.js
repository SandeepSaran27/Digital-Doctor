const express = require('express');
const router = express.Router();
const { getPatients, getPatient, createPatient, updatePatient, deletePatient, addVisit, uploadLabReport, getPatientByQR } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { audit } = require('../middleware/auditMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);
router.get('/', authorize('admin', 'doctor', 'receptionist'), getPatients);
router.get('/qr/:patientId', authorize('admin', 'doctor', 'receptionist'), getPatientByQR);
router.get('/:id', authorize('admin', 'doctor', 'receptionist'), audit('VIEW_PATIENT', 'Patient'), getPatient);
router.post('/', authorize('admin', 'receptionist'), createPatient);
router.put('/:id', authorize('admin', 'doctor', 'receptionist'), updatePatient);
router.delete('/:id', authorize('admin'), deletePatient);
router.post('/:id/visits', authorize('doctor'), audit('ADD_VISIT', 'Patient'), addVisit);
router.post('/:id/lab-reports', authorize('admin', 'doctor', 'receptionist'), upload.single('file'), uploadLabReport);

module.exports = router;
