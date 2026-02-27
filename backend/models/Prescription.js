const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: String,         // e.g. '500mg'
    frequency: String,      // e.g. '3 times a day'
    duration: String,       // e.g. '7 days'
    instructions: String,   // e.g. 'After meals'
    quantity: Number,
});

const prescriptionSchema = new mongoose.Schema(
    {
        prescriptionId: { type: String, unique: true }, // system-generated e.g. RX-2024-001
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        patientRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },

        diagnosis: { type: String, required: true },
        chiefComplaint: String,
        medicines: [medicineSchema],
        instructions: String,     // General instructions for patient
        followUpDate: Date,
        additionalNotes: String,

        // PDF path on server
        pdfPath: String,

        // QR code data (base64 or URL)
        qrCode: String,
        // QR verification hash
        qrHash: { type: String, unique: true },

        isVerified: { type: Boolean, default: false },
        status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
