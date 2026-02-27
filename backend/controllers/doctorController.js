const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @route GET /api/doctors
const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor', isActive: true })
            .select('name email phone specialization licenseNumber consultationFee availability profilePicture')
            .sort({ name: 1 });
        res.json({ success: true, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/doctors/:id/availability
const getDoctorAvailability = async (req, res) => {
    try {
        const doctor = await User.findById(req.params.id).select('name specialization availability');
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        // Get booked slots for next 7 days
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const next7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const bookedAppts = await Appointment.find({ doctor: req.params.id, date: { $gte: today, $lte: next7 }, status: { $ne: 'cancelled' } })
            .select('date timeSlot tokenNumber');

        res.json({ success: true, data: { doctor, availability: doctor.availability, bookedSlots: bookedAppts } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/doctors/:id/availability
const updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body;
        const doctor = await User.findByIdAndUpdate(req.params.id, { availability }, { new: true }).select('name availability');
        res.json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/doctors/:id/appointments - doctor's own schedule
const getDoctorSchedule = async (req, res) => {
    try {
        const { date } = req.query;
        const query = { doctor: req.params.id };
        if (date) {
            const d = new Date(date); d.setHours(0, 0, 0, 0);
            const dEnd = new Date(date); dEnd.setHours(23, 59, 59, 999);
            query.date = { $gte: d, $lte: dEnd };
        }
        const appointments = await Appointment.find(query)
            .populate('patient', 'name phone patientId dateOfBirth')
            .sort({ tokenNumber: 1 });
        res.json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDoctors, getDoctorAvailability, updateAvailability, getDoctorSchedule };
