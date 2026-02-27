const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who performed action
        action: { type: String, required: true }, // e.g. 'VIEW_PATIENT', 'UPDATE_PRESCRIPTION'
        resource: { type: String },               // collection name e.g. 'Patient'
        resourceId: { type: mongoose.Schema.Types.ObjectId }, // doc ID
        description: String,
        ipAddress: String,
        userAgent: String,
        status: { type: String, enum: ['success', 'failure'], default: 'success' },
    },
    { timestamps: true }
);

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
