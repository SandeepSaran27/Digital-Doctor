const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        appointmentId: { type: String, unique: true }, // e.g. APT-20240101-001
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        timeSlot: { type: String }, // e.g. '10:00 AM'
        tokenNumber: { type: Number },
        type: { type: String, enum: ['online', 'walkin'], default: 'walkin' },
        status: {
            type: String,
            enum: ['waiting', 'in-consultation', 'completed', 'cancelled', 'no-show'],
            default: 'waiting',
        },
        chiefComplaint: String,
        notes: String,
        // Fees
        consultationFee: Number,
        isPaid: { type: Boolean, default: false },
        // Reminder tracking
        reminderSent: { type: Boolean, default: false },
        reminderSentAt: Date,
        // QR check-in
        checkedInViaQR: { type: Boolean, default: false },
        checkedInAt: Date,
    },
    { timestamps: true }
);

// Index for fast daily queries
appointmentSchema.index({ date: 1, status: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ patient: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
