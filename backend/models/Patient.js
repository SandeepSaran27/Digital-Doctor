const mongoose = require('mongoose');

// Embedded visit schema
const visitSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chiefComplaint: String,
    diagnosis: String,
    notes: String,
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
    vitalSigns: {
        bloodPressure: String,
        heartRate: String,
        temperature: String,
        weight: String,
        height: String,
        oxygenSaturation: String,
    },
});

// Lab report sub-schema
const labReportSchema = new mongoose.Schema({
    name: String,
    filePath: String,
    fileType: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String,
});

// Medical allergy/condition sub-schema
const medicalHistorySchema = new mongoose.Schema({
    condition: String,
    diagnosedDate: Date,
    status: { type: String, enum: ['active', 'resolved', 'chronic'], default: 'active' },
    notes: String,
});

const patientSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        patientId: { type: String, unique: true }, // system-generated e.g. P-001234

        // Encrypted sensitive fields
        bloodGroup: String,
        allergies: [String],
        chronicConditions: [String],
        currentMedications: [String],

        medicalHistory: [medicalHistorySchema],
        visits: [visitSchema],
        labReports: [labReportSchema],
        prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],

        // Insurance info
        insuranceProvider: String,
        insurancePolicyNumber: String,

        // Chat sessions from AI chatbot
        chatSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' }],

        // Emergency contacts (redundant but patient-record level)
        emergencyContacts: [
            {
                name: String,
                phone: String,
                relation: String,
            },
        ],

        notes: String, // General notes by doctor
    },
    { timestamps: true }
);

// Text search index for name, phone, patientId
patientSchema.index({ patientId: 'text' });

module.exports = mongoose.model('Patient', patientSchema);
