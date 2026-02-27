const express = require('express');
const router = express.Router();
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getAuditLogs,
    getAdminStats,
    toggleUserStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { audit } = require('../middleware/auditMiddleware');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// User management
router.get('/users', getUsers);
router.post('/users', audit('ADMIN_CREATE_USER', 'user'), createUser);
router.put('/users/:id', audit('ADMIN_UPDATE_USER', 'user'), updateUser);
router.delete('/users/:id', audit('ADMIN_DELETE_USER', 'user'), deleteUser);
router.put('/users/:id/toggle-status', audit('ADMIN_TOGGLE_USER_STATUS', 'user'), toggleUserStatus);

// System stats
router.get('/stats', getAdminStats);

// System audit logs
router.get('/logs', getAuditLogs);

module.exports = router;
