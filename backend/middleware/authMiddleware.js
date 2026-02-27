const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — requires a valid JWT in the HTTP-only `token` cookie.
 */
const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        if (!req.user.isActive) {
            return res.status(401).json({ success: false, message: 'Account deactivated' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
};

/**
 * optionalAuth — attaches user if a valid cookie exists; does not fail if absent.
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        }
        next();
    } catch {
        next();
    }
};

module.exports = { protect, optionalAuth };
    