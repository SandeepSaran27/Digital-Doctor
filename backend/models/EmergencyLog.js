const mongoose = require('mongoose');

const emergencyLogSchema = new mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        patientRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
        triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // doctor/receptionist
        notifiedDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        contactsNotified: [
            {
                name: String,
                phone: String,
                email: String,
                method: { type: String, enum: ['email', 'sms', 'both'] },
                sentAt: Date,
            },
        ],
        description: String, // Emergency description
        severity: { type: String, enum: ['critical', 'urgent', 'moderate'], default: 'critical' },
        status: { type: String, enum: ['active', 'resolved'], default: 'active' },
        resolvedAt: Date,
        resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        resolutionNotes: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('EmergencyLog', emergencyLogSchema);
