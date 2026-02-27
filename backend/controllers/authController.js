const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { generatePatientId, generateSessionId } = require('../utils/generateId');
const { generatePatientQR } = require('../services/qrService');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/**
 * Set JWT as an HTTP-only cookie and return { success, user }.
 * The token is never exposed to JavaScript.
 */
const sendTokenCookie = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
    // Never send the raw token in the response body
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    res.status(statusCode).json({ success: true, user: userObj });
};

// @route POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, phone, password, role, specialization, licenseNumber, dateOfBirth, gender, bloodGroup, address } = req.body;
        const existing = await User.findOne({ $or: [{ email }, { phone }] });
        if (existing) return res.status(400).json({ success: false, message: 'Email or phone already registered' });

        const user = await User.create({ name, email, phone, password, role: role || 'patient', specialization, licenseNumber, dateOfBirth, gender, bloodGroup, address });

        // If patient, create patient record
        if (user.role === 'patient') {
            const patientId = generatePatientId();
            const qrCode = await generatePatientQR(patientId, user._id.toString());
            await Patient.create({ user: user._id, patientId });
            user.patientId = patientId;
            user.qrCode = qrCode;
            await user.save();
        }

        sendTokenCookie(user, 201, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        if (!user.isActive) return res.status(401).json({ success: false, message: 'Account deactivated. Contact admin.' });

        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        sendTokenCookie(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/auth/logout
const logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
    res.json({ success: true, message: 'Logged out successfully' });
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
    res.json({ success: true, data: req.user });
};

// @route PUT /api/auth/update-password
const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+password');
        const { currentPassword, newPassword } = req.body;
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
        // Re-issue cookie with fresh token after password change
        sendTokenCookie(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/auth/update-profile
const updateProfile = async (req, res) => {
    try {
        const allowed = ['name', 'phone', 'address', 'dateOfBirth', 'gender', 'bloodGroup', 'emergencyContact'];
        const updates = {};
        allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login, logout, getMe, updatePassword, updateProfile };
