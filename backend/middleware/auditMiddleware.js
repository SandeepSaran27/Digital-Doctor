const AuditLog = require('../models/AuditLog');

// Middleware factory: audit(action, resource)
const audit = (action, resource) => async (req, res, next) => {
    const originalSend = res.json.bind(res);
    res.json = async (data) => {
        try {
            await AuditLog.create({
                user: req.user?._id,
                action,
                resource,
                resourceId: req.params?.id || req.body?._id,
                description: `${req.method} ${req.originalUrl}`,
                ipAddress: req.ip || req.connection?.remoteAddress,
                userAgent: req.headers['user-agent'],
                status: res.statusCode < 400 ? 'success' : 'failure',
            });
        } catch (err) {
            console.error('Audit log error:', err.message);
        }
        return originalSend(data);
    };
    next();
};

module.exports = { audit };
