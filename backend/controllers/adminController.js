const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const Patient = require('../models/Patient');

// @route GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const { role, page = 1, limit = 20, search } = req.query;
        const query = {};
        if (role) query.role = role;
        if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
        const [users, total] = await Promise.all([
            User.find(query).select('-password').skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 }),
            User.countDocuments(query),
        ]);
        res.json({ success: true, data: users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/admin/users
const createUser = async (req, res) => {
    try {
        const { name, email, phone, password, role, specialization, licenseNumber, consultationFee } = req.body;
        const existing = await User.findOne({ $or: [{ email }, { phone }] });
        if (existing) return res.status(400).json({ success: false, message: 'User already exists' });
        const user = await User.create({ name, email, phone, password, role, specialization, licenseNumber, consultationFee });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/admin/users/:id
const updateUser = async (req, res) => {
    try {
        const { password, ...data } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/admin/users/:id/toggle-status
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.isActive = !user.isActive;
        await user.save({ validateBeforeSave: false });
        res.json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted permanently' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/admin/logs
const getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, user, action } = req.query;
        const query = {};
        if (user) query.user = user;
        if (action) query.action = { $regex: action, $options: 'i' };
        const [logs, total] = await Promise.all([
            AuditLog.find(query).populate('user', 'name role email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)),
            AuditLog.countDocuments(query),
        ]);
        res.json({ success: true, data: logs, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/admin/stats
const getAdminStats = async (req, res) => {
    try {
        const [totalPatients, totalDoctors, totalStaff, totalAuditLogs] = await Promise.all([
            User.countDocuments({ role: 'patient' }),
            User.countDocuments({ role: 'doctor' }),
            User.countDocuments({ role: { $in: ['admin', 'receptionist'] } }),
            AuditLog.countDocuments(),
        ]);
        res.json({ success: true, data: { totalPatients, totalDoctors, totalStaff, totalAuditLogs } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getUsers, createUser, updateUser, toggleUserStatus, deleteUser, getAuditLogs, getAdminStats };
