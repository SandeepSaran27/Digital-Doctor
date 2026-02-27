const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { audit } = require('../middleware/auditMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Patient = require('../models/Patient');
const AuditLog = require('../models/AuditLog');
const path = require('path');
const fs = require('fs');

// All routes require auth
router.use(protect);

// Upload a lab report for a patient
router.post(
    '/patient/:patientId/upload',
    authorize('doctor', 'admin', 'receptionist'),
    upload.single('labReport'),
    audit('UPLOAD_LAB_REPORT', 'lab-report'),
    async (req, res) => {
        try {
            const { patientId } = req.params;
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }
            const patient = await Patient.findById(patientId);
            if (!patient) {
                return res.status(404).json({ success: false, message: 'Patient not found' });
            }
            const reportEntry = {
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                uploadedBy: req.user._id,
                uploadedAt: new Date(),
                notes: req.body.notes || '',
            };
            patient.labReports.push(reportEntry);
            await patient.save();
            res.status(201).json({
                success: true,
                message: 'Lab report uploaded successfully',
                data: reportEntry,
            });
        } catch (error) {
            console.error('Lab report upload error:', error);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
);

// Get all lab reports for a patient
router.get(
    '/patient/:patientId',
    audit('VIEW_LAB_REPORTS', 'lab-report'),
    async (req, res) => {
        try {
            const patient = await Patient.findById(req.params.patientId)
                .select('labReports firstName lastName')
                .populate('labReports.uploadedBy', 'name role');
            if (!patient) {
                return res.status(404).json({ success: false, message: 'Patient not found' });
            }
            res.json({ success: true, data: patient.labReports });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
);

// Download / stream a specific lab report
router.get(
    '/:reportId/download',
    audit('DOWNLOAD_LAB_REPORT', 'lab-report'),
    async (req, res) => {
        try {
            // Find patient that has this report
            const patient = await Patient.findOne({ 'labReports._id': req.params.reportId });
            if (!patient) {
                return res.status(404).json({ success: false, message: 'Report not found' });
            }
            const report = patient.labReports.id(req.params.reportId);
            if (!report) {
                return res.status(404).json({ success: false, message: 'Report not found' });
            }
            const filePath = path.resolve(report.filePath);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, message: 'File not found on server' });
            }
            res.download(filePath, report.fileName);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
);

// Delete a lab report
router.delete(
    '/:reportId',
    authorize('doctor', 'admin'),
    audit('DELETE_LAB_REPORT', 'lab-report'),
    async (req, res) => {
        try {
            const patient = await Patient.findOne({ 'labReports._id': req.params.reportId });
            if (!patient) {
                return res.status(404).json({ success: false, message: 'Report not found' });
            }
            const report = patient.labReports.id(req.params.reportId);
            // Remove file from disk
            if (report && fs.existsSync(report.filePath)) {
                fs.unlinkSync(report.filePath);
            }
            patient.labReports.pull(req.params.reportId);
            await patient.save();
            res.json({ success: true, message: 'Lab report deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
);

module.exports = router;
