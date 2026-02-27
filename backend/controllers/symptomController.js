const SymptomAnalysis = require('../models/SymptomAnalysis');
const Patient = require('../models/Patient');
const { analyzeSymptoms } = require('../services/aiService');

// Symptom-disease knowledge base (built-in ML mapping)
const symptomDiseaseMap = {
    fever: [{ name: 'Influenza', prob: 75 }, { name: 'Malaria', prob: 60 }, { name: 'Typhoid', prob: 55 }, { name: 'COVID-19', prob: 50 }],
    cough: [{ name: 'Common Cold', prob: 70 }, { name: 'Bronchitis', prob: 60 }, { name: 'Pneumonia', prob: 45 }, { name: 'COVID-19', prob: 55 }],
    headache: [{ name: 'Tension Headache', prob: 80 }, { name: 'Migraine', prob: 65 }, { name: 'Hypertension', prob: 40 }],
    'chest pain': [{ name: 'Angina', prob: 70 }, { name: 'Heart Attack', prob: 60 }, { name: 'GERD', prob: 55 }],
    'shortness of breath': [{ name: 'Asthma', prob: 70 }, { name: 'COPD', prob: 55 }, { name: 'Heart Failure', prob: 50 }, { name: 'Pneumonia', prob: 60 }],
    diarrhea: [{ name: 'Gastroenteritis', prob: 80 }, { name: 'Food Poisoning', prob: 75 }, { name: 'IBS', prob: 45 }],
    vomiting: [{ name: 'Gastroenteritis', prob: 75 }, { name: 'Food Poisoning', prob: 70 }, { name: 'Appendicitis', prob: 35 }],
    fatigue: [{ name: 'Anemia', prob: 60 }, { name: 'Diabetes', prob: 45 }, { name: 'Hypothyroidism', prob: 50 }],
    'joint pain': [{ name: 'Arthritis', prob: 70 }, { name: 'Gout', prob: 55 }, { name: 'Lupus', prob: 30 }],
    rash: [{ name: 'Allergy', prob: 70 }, { name: 'Eczema', prob: 60 }, { name: 'Chickenpox', prob: 50 }],
    'abdominal pain': [{ name: 'Gastritis', prob: 65 }, { name: 'Appendicitis', prob: 50 }, { name: 'IBS', prob: 55 }],
    dizziness: [{ name: 'Vertigo', prob: 70 }, { name: 'Low Blood Pressure', prob: 60 }, { name: 'Anemia', prob: 45 }],
};

const emergencySymptoms = ['chest pain', 'shortness of breath', 'unconscious', 'seizure', 'severe bleeding', 'paralysis', 'sudden vision loss'];

// Aggregate conditions from multiple symptoms and normalize probabilities
const aggregateConditions = (symptoms) => {
    const condMap = {};
    symptoms.forEach((sym) => {
        const sym_lower = sym.toLowerCase();
        (symptomDiseaseMap[sym_lower] || []).forEach(({ name, prob }) => {
            if (!condMap[name]) condMap[name] = { name, totalProb: 0, count: 0, description: `Condition associated with ${sym}`, recommendations: ['Consult a doctor', 'Rest and hydrate', 'Monitor symptoms'] };
            condMap[name].totalProb += prob;
            condMap[name].count += 1;
        });
    });
    return Object.values(condMap)
        .map((c) => ({ name: c.name, probability: Math.min(Math.round(c.totalProb / c.count), 95), description: c.description, recommendations: c.recommendations }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 5);
};

// @route POST /api/symptoms/analyze
const analyzeSymptomRoute = async (req, res) => {
    try {
        const { symptoms, saveToRecord } = req.body;
        if (!symptoms || symptoms.length === 0) return res.status(400).json({ success: false, message: 'Please provide symptoms' });

        const possibleConditions = aggregateConditions(symptoms);
        const isEmergency = symptoms.some((s) => emergencySymptoms.includes(s.toLowerCase()));

        // Determine severity
        const topProb = possibleConditions[0]?.probability || 0;
        let severity = 'low';
        if (isEmergency) severity = 'critical';
        else if (topProb >= 70) severity = 'high';
        else if (topProb >= 50) severity = 'medium';

        // Get AI suggestions (non-blocking)
        let aiSuggestions = 'Consult a qualified doctor for proper diagnosis.';
        try {
            const aiResult = await analyzeSymptoms(symptoms);
            aiSuggestions = aiResult.suggestions;
        } catch { /* AI optional */ }

        const analysis = await SymptomAnalysis.create({
            patient: req.user?._id,
            symptoms,
            possibleConditions,
            severity,
            emergencyFlag: isEmergency,
            emergencyReason: isEmergency ? 'Critical symptoms detected — seek immediate medical attention' : null,
            aiSuggestions,
        });

        // Optionally save to patient record
        if (saveToRecord && req.user?.role === 'patient') {
            const record = await Patient.findOne({ user: req.user._id });
            if (record) {
                record.medicalHistory.push({ condition: possibleConditions[0]?.name || 'Symptom Analysis', status: 'active', notes: `Symptoms: ${symptoms.join(', ')}` });
                await record.save();
                analysis.savedToRecord = true;
                await analysis.save();
            }
        }

        res.status(201).json({ success: true, data: analysis });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/symptoms/list — return all known symptoms
const getSymptomList = async (req, res) => {
    const allSymptoms = [...new Set([...Object.keys(symptomDiseaseMap), 'nausea', 'back pain', 'sore throat', 'runny nose', 'swelling', 'numbness', 'confusion', 'anxiety', 'insomnia', 'weight loss', 'weight gain', 'frequent urination', 'excessive thirst'])];
    res.json({ success: true, data: allSymptoms });
};

// @route GET /api/symptoms/history
const getHistory = async (req, res) => {
    try {
        const analyses = await SymptomAnalysis.find({ patient: req.user._id }).sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, data: analyses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { analyzeSymptomRoute, getSymptomList, getHistory };
