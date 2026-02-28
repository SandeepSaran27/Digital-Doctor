/*const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { generateAppointmentId, generateToken } = require('../utils/generateId');
const { sendAppointmentReminder } = require('../services/emailService');
const { sendAppointmentSMS } = require('../services/smsService');

// @route GET /api/appointments
const getAppointments = async (req, res) => {
    try {
        const { date, doctor, status, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;
        const query = {};
        if (date) {
            const d = new Date(date);
            const start = new Date(d); start.setHours(0, 0, 0, 0);
            const end = new Date(d); end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }
        if (doctor) query.doctor = doctor;
        if (status) query.status = status;
        // Patient can only see own appointments
        if (req.user.role === 'patient') query.patient = req.user._id;

        const [appointments, total] = await Promise.all([
            Appointment.find(query)
                .populate('patient', 'name phone patientId')
                .populate('doctor', 'name specialization')
                .sort({ tokenNumber: 1 })
                .skip(skip).limit(parseInt(limit)),
            Appointment.countDocuments(query),
        ]);
        res.json({ success: true, data: appointments, total, page: parseInt(page) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/appointments/queue
const getQueue = async (req, res) => {
    try {
        const { doctor, date } = req.query;
        const d = date ? new Date(date) : new Date();
        const start = new Date(d); start.setHours(0, 0, 0, 0);
        const end = new Date(d); end.setHours(23, 59, 59, 999);
        const query = { date: { $gte: start, $lte: end }, status: { $in: ['waiting', 'in-consultation'] } };
        if (doctor) query.doctor = doctor;

        const queue = await Appointment.find(query)
            .populate('patient', 'name phone patientId')
            .populate('doctor', 'name')
            .sort({ tokenNumber: 1 });
        res.json({ success: true, data: queue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/appointments
const bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, timeSlot, type, chiefComplaint } = req.body;

        const [patient, doctor] = await Promise.all([
            User.findById(patientId || req.user._id),
            User.findById(doctorId),
        ]);
        if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ success: false, message: 'Doctor not found' });

        const tokenNumber = await generateToken(Appointment, doctorId, date);
        const appointment = await Appointment.create({
            appointmentId: generateAppointmentId(),
            patient: patientId || req.user._id,
            doctor: doctorId,
            date,
            timeSlot,
            tokenNumber,
            type: type || 'walkin',
            chiefComplaint,
            consultationFee: doctor.consultationFee,
        });

        // Send reminder (non-blocking)
        if (patient?.email) {
            sendAppointmentReminder({ patientEmail: patient.email, patientName: patient.name, doctorName: doctor.name, date, timeSlot, tokenNumber }).catch(console.error);
        }
        if (patient?.phone) {
            sendAppointmentSMS({ to: patient.phone, patientName: patient.name, date, timeSlot, tokenNumber }).catch(console.error);
        }

        const populated = await appointment.populate([{ path: 'patient', select: 'name phone patientId' }, { path: 'doctor', select: 'name specialization' }]);
        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/appointments/:id/status
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate('patient', 'name phone').populate('doctor', 'name');
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        res.json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/appointments/:id/checkin  — QR check-in
const checkIn = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { checkedInViaQR: true, checkedInAt: new Date() },
            { new: true }
        );
        res.json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route DELETE /api/appointments/:id
const cancelAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
        res.json({ success: true, message: 'Appointment cancelled' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAppointments, getQueue, bookAppointment, updateStatus, checkIn, cancelAppointment };
*/

const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { generateAppointmentId, generateToken } = require('../utils/generateId');
const { sendAppointmentReminder } = require('../services/emailService');
const { sendAppointmentSMS } = require('../services/smsService');

// @route GET /api/appointments
const getAppointments = async (req, res) => {
    try {
        const { date, doctor, status, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;
        const query = {};
        if (date) {
            const d = new Date(date);
            const start = new Date(d); start.setHours(0, 0, 0, 0);
            const end = new Date(d); end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }
        if (doctor) query.doctor = doctor;
        if (status) query.status = status;
        // Patient can only see own appointments
        if (req.user.role === 'patient') query.patient = req.user._id;

        const [appointments, total] = await Promise.all([
            Appointment.find(query)
                .populate('patient', 'name phone patientId')
                .populate('doctor', 'name specialization')
                .sort({ tokenNumber: 1 })
                .skip(skip).limit(parseInt(limit)),
            Appointment.countDocuments(query),
        ]);
        res.json({ success: true, data: appointments, total, page: parseInt(page) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/appointments/queue
const getQueue = async (req, res) => {
    try {
        const { doctor, date } = req.query;
        const d = date ? new Date(date) : new Date();
        const start = new Date(d); start.setHours(0, 0, 0, 0);
        const end = new Date(d); end.setHours(23, 59, 59, 999);
        const query = { date: { $gte: start, $lte: end }, status: { $in: ['waiting', 'in-consultation'] } };
        if (doctor) query.doctor = doctor;

        const queue = await Appointment.find(query)
            .populate('patient', 'name phone patientId')
            .populate('doctor', 'name')
            .sort({ tokenNumber: 1 });
        res.json({ success: true, data: queue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/appointments
const bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, timeSlot, type, chiefComplaint } = req.body;

        const [patient, doctor] = await Promise.all([
            User.findById(patientId || req.user._id),
            User.findById(doctorId),
        ]);
        if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ success: false, message: 'Doctor not found' });

        const tokenNumber = await generateToken(Appointment, doctorId, date);
        const appointment = await Appointment.create({
            appointmentId: generateAppointmentId(),
            patient: patientId || req.user._id,
            doctor: doctorId,
            date,
            timeSlot,
            tokenNumber,
            type: type || 'walkin',
            chiefComplaint,
            consultationFee: doctor.consultationFee,
        });

        // Send reminder (non-blocking)
        if (patient?.email) {
            sendAppointmentReminder({ patientEmail: patient.email, patientName: patient.name, doctorName: doctor.name, date, timeSlot, tokenNumber }).catch(console.error);
        }
        if (patient?.phone) {
            sendAppointmentSMS({ to: patient.phone, patientName: patient.name, date, timeSlot, tokenNumber }).catch(console.error);
        }

        const populated = await appointment.populate([{ path: 'patient', select: 'name phone patientId' }, { path: 'doctor', select: 'name specialization' }]);
        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/appointments/:id/status
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate('patient', 'name phone').populate('doctor', 'name');
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        res.json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/appointments/:id/checkin  — QR check-in
const checkIn = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { checkedInViaQR: true, checkedInAt: new Date() },
            { new: true }
        );
        res.json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route DELETE /api/appointments/:id
const cancelAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
        res.json({ success: true, message: 'Appointment cancelled' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAppointments, getQueue, bookAppointment, updateStatus, checkIn, cancelAppointment };
