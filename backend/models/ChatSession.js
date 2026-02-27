const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        sessionId: { type: String, unique: true }, // UUID
        messages: [messageSchema],
        language: { type: String, default: 'en' },
        // AI-generated summary of symptoms discussed
        symptomSummary: String,
        // Whether session was saved to patient record
        savedToRecord: { type: Boolean, default: false },
        patientRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('ChatSession', chatSessionSchema);
