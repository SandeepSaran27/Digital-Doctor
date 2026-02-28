/*const Appointment = require('../models/Appointment');
const User = require('../models/User');
const SymptomAnalysis = require('../models/SymptomAnalysis');
const EmergencyLog = require('../models/EmergencyLog');

// @route GET /api/analytics/dashboard
const getDashboard = async (req, res) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
        const last7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [todayAppts, todayCompleted, pendingQueue, weeklyAppts, monthlyPatients, emergencyCount, topConditions] = await Promise.all([
            Appointment.countDocuments({ date: { $gte: today, $lte: todayEnd } }),
            Appointment.countDocuments({ date: { $gte: today, $lte: todayEnd }, status: 'completed' }),
            Appointment.countDocuments({ date: { $gte: today, $lte: todayEnd }, status: { $in: ['waiting', 'in-consultation'] } }),
            Appointment.aggregate([
                { $match: { date: { $gte: last7 } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
            User.countDocuments({ role: 'patient', createdAt: { $gte: last30 } }),
            EmergencyLog.countDocuments({ createdAt: { $gte: last30 } }),
            SymptomAnalysis.aggregate([
                { $unwind: '$possibleConditions' },
                { $group: { _id: '$possibleConditions.name', count: { $sum: 1 } } },
                { $sort: { count: -1 } }, { $limit: 5 },
            ]),
        ]);

        res.json({
            success: true,
            data: {
                today: { total: todayAppts, completed: todayCompleted, pending: pendingQueue },
                weeklyTrend: weeklyAppts,
                newPatientsThisMonth: monthlyPatients,
                emergenciesThisMonth: emergencyCount,
                topConditions,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/analytics/appointments - trends by month
const getAppointmentTrends = async (req, res) => {
    try {
        const last6months = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
        const trend = await Appointment.aggregate([
            { $match: { createdAt: { $gte: last6months } } },
            { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, count: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
        res.json({ success: true, data: trend });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/analytics/diseases - common conditions
const getDiseaseStats = async (req, res) => {
    try {
        const stats = await SymptomAnalysis.aggregate([
            { $unwind: '$possibleConditions' },
            { $group: { _id: '$possibleConditions.name', total: { $sum: 1 }, avgProb: { $avg: '$possibleConditions.probability' } } },
            { $sort: { total: -1 } }, { $limit: 10 },
        ]);
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/analytics/emergency
const getEmergencyStats = async (req, res) => {
    try {
        const [total, active, critical, byMonth] = await Promise.all([
            EmergencyLog.countDocuments(),
            EmergencyLog.countDocuments({ status: 'active' }),
            EmergencyLog.countDocuments({ severity: 'critical' }),
            EmergencyLog.aggregate([
                { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { '_id.year': 1, '_id.month': 1 } }, { $limit: 6 },
            ]),
        ]);
        res.json({ success: true, data: { total, active, critical, byMonth } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboard, getAppointmentTrends, getDiseaseStats, getEmergencyStats };
*/

const Appointment = require('../models/Appointment');
const User = require('../models/User');
const SymptomAnalysis = require('../models/SymptomAnalysis');
const EmergencyLog = require('../models/EmergencyLog');

// @route GET /api/analytics/dashboard
const getDashboard = async (req, res) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
        const last7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const apptQuery = { date: { $gte: today, $lte: todayEnd } };
        const trendMatch = { date: { $gte: last7 } };

        if (req.user.role === 'patient') {
            apptQuery.patient = req.user._id;
            trendMatch.patient = req.user._id;
        } else if (req.user.role === 'doctor') {
            apptQuery.doctor = req.user._id;
            trendMatch.doctor = req.user._id;
        }

        const [todayAppts, todayCompleted, pendingQueue, weeklyAppts, monthlyPatients, emergencyCount, topConditions] = await Promise.all([
            Appointment.countDocuments(apptQuery),
            Appointment.countDocuments({ ...apptQuery, status: 'completed' }),
            Appointment.countDocuments({ ...apptQuery, status: { $in: ['waiting', 'in-consultation'] } }),
            Appointment.aggregate([
                { $match: trendMatch },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
            User.countDocuments({ role: 'patient', createdAt: { $gte: last30 } }),
            EmergencyLog.countDocuments({ createdAt: { $gte: last30 } }),
            SymptomAnalysis.aggregate([
                { $unwind: '$possibleConditions' },
                { $group: { _id: '$possibleConditions.name', count: { $sum: 1 } } },
                { $sort: { count: -1 } }, { $limit: 5 },
            ]),
        ]);

        res.json({
            success: true,
            data: {
                today: { total: todayAppts, completed: todayCompleted, pending: pendingQueue },
                weeklyTrend: weeklyAppts,
                newPatientsThisMonth: monthlyPatients,
                emergenciesThisMonth: emergencyCount,
                topConditions,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/analytics/appointments - trends by month
const getAppointmentTrends = async (req, res) => {
    try {
        const last6months = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
        const matchStage = { createdAt: { $gte: last6months } };

        if (req.user.role === 'patient') matchStage.patient = req.user._id;
        else if (req.user.role === 'doctor') matchStage.doctor = req.user._id;

        const trend = await Appointment.aggregate([
            { $match: matchStage },
            { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, count: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
        res.json({ success: true, data: trend });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/analytics/diseases - common conditions
const getDiseaseStats = async (req, res) => {
    try {
        const stats = await SymptomAnalysis.aggregate([
            { $unwind: '$possibleConditions' },
            { $group: { _id: '$possibleConditions.name', total: { $sum: 1 }, avgProb: { $avg: '$possibleConditions.probability' } } },
            { $sort: { total: -1 } }, { $limit: 10 },
        ]);
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/analytics/emergency
const getEmergencyStats = async (req, res) => {
    try {
        const [total, active, critical, byMonth] = await Promise.all([
            EmergencyLog.countDocuments(),
            EmergencyLog.countDocuments({ status: 'active' }),
            EmergencyLog.countDocuments({ severity: 'critical' }),
            EmergencyLog.aggregate([
                { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { '_id.year': 1, '_id.month': 1 } }, { $limit: 6 },
            ]),
        ]);
        res.json({ success: true, data: { total, active, critical, byMonth } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboard, getAppointmentTrends, getDiseaseStats, getEmergencyStats };
