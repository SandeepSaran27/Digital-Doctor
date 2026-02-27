const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
    name: String,
    probability: Number,      // 0-100
    description: String,
    recommendations: [String],
});

const symptomAnalysisSchema = new mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        patientRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
        symptoms: [{ type: String }],
        possibleConditions: [conditionSchema],
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
        emergencyFlag: { type: Boolean, default: false },
        emergencyReason: String,
        aiSuggestions: String,
        savedToRecord: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('SymptomAnalysis', symptomAnalysisSchema);
