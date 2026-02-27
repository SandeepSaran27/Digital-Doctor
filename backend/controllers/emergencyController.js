const EmergencyLog = require('../models/EmergencyLog');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { sendEmergencyAlert } = require('../services/emailService');
const { sendEmergencySMS } = require('../services/smsService');

// @route POST /api/emergency/alert
const triggerEmergency = async (req, res) => {
    try {
        const { patientId, description, severity } = req.body;

        const patient = await User.findById(patientId).select('-password');
        if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

        const patientRecord = await Patient.findOne({ user: patientId });

        // Fetch all on-duty doctors
        const doctors = await User.find({ role: 'doctor', isActive: true }).select('name email phone');

        // Build medical history summary
        const historyText = patientRecord
            ? `Allergies: ${(patientRecord.allergies || []).join(', ') || 'None'}\nChronic Conditions: ${(patientRecord.chronicConditions || []).join(', ') || 'None'}\nCurrent Medications: ${(patientRecord.currentMedications || []).join(', ') || 'None'}`
            : 'No record found';

        // Notify all doctors via email (non-blocking)
        const notifiedDoctors = [];
        for (const doc of doctors) {
            if (doc.email) {
                sendEmergencyAlert({ to: doc.email, patientName: patient.name, patientId: patient.patientId, description, medicalHistory: historyText }).catch(console.error);
                notifiedDoctors.push(doc._id);
            }
        }

        // Notify emergency contacts
        const contactsNotified = [];
        const contacts = patientRecord?.emergencyContacts || (patient.emergencyContact ? [patient.emergencyContact] : []);
        for (const contact of contacts) {
            if (contact.phone) {
                sendEmergencySMS({ to: contact.phone, patientName: patient.name }).catch(console.error);
            }
            if (contact.email || contact.phone) {
                contactsNotified.push({ name: contact.name, phone: contact.phone, email: contact.email || '', method: 'both', sentAt: new Date() });
            }
        }

        const log = await EmergencyLog.create({
            patient: patientId,
            patientRecord: patientRecord?._id,
            triggeredBy: req.user._id,
            notifiedDoctors,
            contactsNotified,
            description,
            severity: severity || 'critical',
        });

        const populated = await log.populate([
            { path: 'patient', select: 'name phone patientId bloodGroup' },
            { path: 'triggeredBy', select: 'name role' },
        ]);

        res.status(201).json({
            success: true,
            data: populated,
            patientSummary: { patient, medicalHistory: historyText, patientRecord },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/emergency/logs
const getEmergencyLogs = async (req, res) => {
    try {
        const logs = await EmergencyLog.find()
            .populate('patient', 'name phone patientId')
            .populate('triggeredBy', 'name role')
            .sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/emergency/:id/resolve
const resolveEmergency = async (req, res) => {
    try {
        const log = await EmergencyLog.findByIdAndUpdate(
            req.params.id,
            { status: 'resolved', resolvedAt: new Date(), resolvedBy: req.user._id, resolutionNotes: req.body.resolutionNotes },
            { new: true }
        );
        res.json({ success: true, data: log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { triggerEmergency, getEmergencyLogs, resolveEmergency };
