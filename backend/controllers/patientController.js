/*const User = require('../models/User');
const Patient = require('../models/Patient');
const { generatePatientId } = require('../utils/generateId');
const { generatePatientQR } = require('../services/qrService');

// @route GET /api/patients
const getPatients = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let query = { role: 'patient' };
        if (search) {
            query = { ...query, $or: [{ name: { $regex: search, $options: 'i' } }, { phone: { $regex: search } }, { patientId: { $regex: search, $options: 'i' } }] };
        }
        const [users, total] = await Promise.all([
            User.find(query).select('-password').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
            User.countDocuments(query),
        ]);
        res.json({ success: true, data: users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/patients/:id
const getPatient = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'Patient not found' });
        const record = await Patient.findOne({ user: user._id })
            .populate('prescriptions')
            .populate({ path: 'visits.doctor', select: 'name specialization' })
            .populate({ path: 'visits.prescription' });
        res.json({ success: true, data: { user, record } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/patients
const createPatient = async (req, res) => {
    try {
        const { name, email, phone, dateOfBirth, gender, bloodGroup, address, emergencyContact, allergies, chronicConditions } = req.body;
        const existing = await User.findOne({ $or: [{ email }, { phone }] });
        if (existing) return res.status(400).json({ success: false, message: 'Patient with this email/phone already exists' });

        const patientId = generatePatientId();
        const user = await User.create({ name, email, phone, password: phone, role: 'patient', dateOfBirth, gender, bloodGroup, address, emergencyContact, patientId });
        const qrCode = await generatePatientQR(patientId, user._id.toString());
        user.qrCode = qrCode;
        await user.save({ validateBeforeSave: false });

        await Patient.create({ user: user._id, patientId, allergies, chronicConditions, emergencyContacts: emergencyContact ? [emergencyContact] : [] });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/patients/:id
const updatePatient = async (req, res) => {
    try {
        const { allergies, chronicConditions, currentMedications, notes, ...userFields } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, userFields, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'Patient not found' });

        const updateData = {};
        if (allergies) updateData.allergies = allergies;
        if (chronicConditions) updateData.chronicConditions = chronicConditions;
        if (currentMedications) updateData.currentMedications = currentMedications;
        if (notes) updateData.notes = notes;

        const record = await Patient.findOneAndUpdate({ user: req.params.id }, updateData, { new: true });
        res.json({ success: true, data: { user, record } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route DELETE /api/patients/:id
const deletePatient = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ success: true, message: 'Patient deactivated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/patients/:id/visits
const addVisit = async (req, res) => {
    try {
        const { chiefComplaint, diagnosis, notes, vitalSigns } = req.body;
        const record = await Patient.findOneAndUpdate(
            { user: req.params.id },
            { $push: { visits: { doctor: req.user._id, chiefComplaint, diagnosis, notes, vitalSigns } } },
            { new: true }
        );
        res.json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/patients/:id/lab-reports
const uploadLabReport = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
        const report = { name: req.body.name || req.file.originalname, filePath: req.file.path, fileType: req.file.mimetype, uploadedBy: req.user._id, notes: req.body.notes };
        const record = await Patient.findOneAndUpdate({ user: req.params.id }, { $push: { labReports: report } }, { new: true });
        res.json({ success: true, data: record.labReports.slice(-1)[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/patients/qr/:patientId — QR check-in lookup
const getPatientByQR = async (req, res) => {
    try {
        const user = await User.findOne({ patientId: req.params.patientId }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'Patient not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getPatients, getPatient, createPatient, updatePatient, deletePatient, addVisit, uploadLabReport, getPatientByQR };
*/

const User = require('../models/User');
const Patient = require('../models/Patient');
const { generatePatientId } = require('../utils/generateId');
const { generatePatientQR } = require('../services/qrService');

// @route GET /api/patients
const getPatients = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        if (req.user.role === 'patient') {
            return res.json({ success: true, data: [req.user], total: 1, page: 1, pages: 1 });
        }

        let query = { role: 'patient' };
        if (search) {
            query = { ...query, $or: [{ name: { $regex: search, $options: 'i' } }, { phone: { $regex: search } }, { patientId: { $regex: search, $options: 'i' } }] };
        }
        const [users, total] = await Promise.all([
            User.find(query).select('-password').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
            User.countDocuments(query),
        ]);
        res.json({ success: true, data: users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/patients/:id
const getPatient = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'Patient not found' });
        const record = await Patient.findOne({ user: user._id })
            .populate('prescriptions')
            .populate({ path: 'visits.doctor', select: 'name specialization' })
            .populate({ path: 'visits.prescription' });
        res.json({ success: true, data: { user, record } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/patients
const createPatient = async (req, res) => {
    try {
        const { name, email, phone, dateOfBirth, gender, bloodGroup, address, emergencyContact, allergies, chronicConditions } = req.body;
        const existing = await User.findOne({ $or: [{ email }, { phone }] });
        if (existing) return res.status(400).json({ success: false, message: 'Patient with this email/phone already exists' });

        const patientId = generatePatientId();
        const user = await User.create({ name, email, phone, password: phone, role: 'patient', dateOfBirth, gender, bloodGroup, address, emergencyContact, patientId });
        const qrCode = await generatePatientQR(patientId, user._id.toString());
        user.qrCode = qrCode;
        await user.save({ validateBeforeSave: false });

        await Patient.create({ user: user._id, patientId, allergies, chronicConditions, emergencyContacts: emergencyContact ? [emergencyContact] : [] });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/patients/:id
const updatePatient = async (req, res) => {
    try {
        const { allergies, chronicConditions, currentMedications, notes, ...userFields } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, userFields, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'Patient not found' });

        const updateData = {};
        if (allergies) updateData.allergies = allergies;
        if (chronicConditions) updateData.chronicConditions = chronicConditions;
        if (currentMedications) updateData.currentMedications = currentMedications;
        if (notes) updateData.notes = notes;

        const record = await Patient.findOneAndUpdate({ user: req.params.id }, updateData, { new: true });
        res.json({ success: true, data: { user, record } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route DELETE /api/patients/:id
const deletePatient = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ success: true, message: 'Patient deactivated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/patients/:id/visits
const addVisit = async (req, res) => {
    try {
        const { chiefComplaint, diagnosis, notes, vitalSigns } = req.body;
        const record = await Patient.findOneAndUpdate(
            { user: req.params.id },
            { $push: { visits: { doctor: req.user._id, chiefComplaint, diagnosis, notes, vitalSigns } } },
            { new: true }
        );
        res.json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/patients/:id/lab-reports
const uploadLabReport = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
        const report = { name: req.body.name || req.file.originalname, filePath: req.file.path, fileType: req.file.mimetype, uploadedBy: req.user._id, notes: req.body.notes };
        const record = await Patient.findOneAndUpdate({ user: req.params.id }, { $push: { labReports: report } }, { new: true });
        res.json({ success: true, data: record.labReports.slice(-1)[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/patients/qr/:patientId — QR check-in lookup
const getPatientByQR = async (req, res) => {
    try {
        const user = await User.findOne({ patientId: req.params.patientId }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'Patient not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getPatients, getPatient, createPatient, updatePatient, deletePatient, addVisit, uploadLabReport, getPatientByQR };
