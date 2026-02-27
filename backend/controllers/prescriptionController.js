const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { generatePrescriptionId, generateVerificationHash } = require('../utils/generateId');
const { generateQR, generateVerificationHash: genHash } = require('../services/qrService');
const { generatePrescriptionPDF } = require('../services/pdfService');
const path = require('path');
const fs = require('fs');

// @route POST /api/prescriptions
const createPrescription = async (req, res) => {
    try {
        const { patientId, appointmentId, diagnosis, chiefComplaint, medicines, instructions, followUpDate, additionalNotes } = req.body;

        const prescriptionId = generatePrescriptionId();
        const qrHash = genHash(prescriptionId, patientId, req.user._id.toString());
        const qrCode = await generateQR(JSON.stringify({ type: 'prescription', id: prescriptionId, hash: qrHash, clinic: 'Digital Doctor' }));

        const prescription = await Prescription.create({
            prescriptionId, patient: patientId, patientRecord: null,
            doctor: req.user._id, appointment: appointmentId,
            diagnosis, chiefComplaint, medicines, instructions,
            followUpDate, additionalNotes, qrCode, qrHash,
        });

        // Link patient record
        const record = await Patient.findOne({ user: patientId });
        if (record) {
            record.prescriptions.push(prescription._id);
            await record.save();
            prescription.patientRecord = record._id;
            await prescription.save();
        }

        // Generate PDF asynchronously
        const patient = await User.findById(patientId).select('name phone patientId');
        const doctor = await User.findById(req.user._id).select('name specialization licenseNumber');
        generatePrescriptionPDF(prescription.toObject(), patient.toObject(), doctor.toObject())
            .then(async (pdfPath) => {
                await Prescription.findByIdAndUpdate(prescription._id, { pdfPath });
            })
            .catch(console.error);

        res.status(201).json({ success: true, data: prescription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/prescriptions/:id
const getPrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('patient', 'name phone dateOfBirth patientId bloodGroup')
            .populate('doctor', 'name specialization licenseNumber');
        if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
        res.json({ success: true, data: prescription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/prescriptions/:id/download - stream PDF
const downloadPrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('patient', 'name phone patientId bloodGroup')
            .populate('doctor', 'name specialization licenseNumber');
        if (!prescription) return res.status(404).json({ success: false, message: 'Not found' });

        let filePath = prescription.pdfPath;
        // If PDF not yet generated, generate on-demand
        if (!filePath || !fs.existsSync(filePath)) {
            const patient = await User.findById(prescription.patient).select('name phone patientId');
            const doctor = await User.findById(prescription.doctor).select('name specialization licenseNumber');
            filePath = await generatePrescriptionPDF(prescription.toObject(), patient.toObject(), doctor.toObject());
            await Prescription.findByIdAndUpdate(prescription._id, { pdfPath: filePath });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${prescription.prescriptionId}.pdf"`);
        fs.createReadStream(filePath).pipe(res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/prescriptions/verify/:hash
const verifyPrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findOne({ qrHash: req.params.hash })
            .populate('patient', 'name patientId').populate('doctor', 'name specialization');
        if (!prescription) return res.status(404).json({ success: false, valid: false, message: 'Invalid QR code' });
        res.json({ success: true, valid: true, data: { prescriptionId: prescription.prescriptionId, patient: prescription.patient, doctor: prescription.doctor, diagnosis: prescription.diagnosis, createdAt: prescription.createdAt } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/prescriptions - patient's own or doctor's issued
const getPrescriptions = async (req, res) => {
    try {
        const query = req.user.role === 'patient' ? { patient: req.user._id } : { doctor: req.user._id };
        const prescriptions = await Prescription.find(query)
            .populate('patient', 'name patientId').populate('doctor', 'name specialization')
            .sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, data: prescriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createPrescription, getPrescription, downloadPrescription, verifyPrescription, getPrescriptions };
