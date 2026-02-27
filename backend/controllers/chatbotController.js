const ChatSession = require('../models/ChatSession');
const Patient = require('../models/Patient');
const { chatWithAI, generateSymptomSummary } = require('../services/aiService');
const { generateSessionId } = require('../utils/generateId');

// @route POST /api/chatbot/session — start new session
const startSession = async (req, res) => {
    try {
        const { language } = req.body;
        const session = await ChatSession.create({ patient: req.user._id, sessionId: generateSessionId(), language: language || 'en', messages: [] });
        res.status(201).json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/chatbot/session/:sessionId/message
const sendMessage = async (req, res) => {
    try {
        const { message, language } = req.body;
        // sessionId in the route is the MongoDB _id of the session
        let session = await ChatSession.findById(req.params.sessionId);
        if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

        // Add user message
        session.messages.push({ role: 'user', content: message });

        // Get AI response
        const aiReply = await chatWithAI(session.messages, language || session.language);

        // Add assistant message
        session.messages.push({ role: 'assistant', content: aiReply });
        await session.save();

        // Return the full updated session so the frontend can sync messages
        res.json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/chatbot/session/:sessionId/save — save session summary to patient record
const saveSession = async (req, res) => {
    try {
        const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
        if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

        const summary = await generateSymptomSummary(session.messages);
        session.symptomSummary = summary;
        session.savedToRecord = true;
        await session.save();

        // Attach to patient record
        if (req.user.role === 'patient') {
            await Patient.findOneAndUpdate(
                { user: req.user._id },
                { $push: { chatSessions: session._id } }
            );
        }

        res.json({ success: true, summary, data: session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/chatbot/sessions
const getSessions = async (req, res) => {
    try {
        const sessions = await ChatSession.find({ patient: req.user._id }).sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, data: sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/chatbot/session/:sessionId
const getSession = async (req, res) => {
    try {
        const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
        if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
        res.json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { startSession, sendMessage, saveSession, getSessions, getSession };
