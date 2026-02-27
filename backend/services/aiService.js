const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
const getGenAI = () => {
    if (!genAI) genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI;
};

const SYSTEM_PROMPT = `You are a helpful medical assistant for a clinic management system.
Your role is to:
- Listen to patient symptoms and provide general health guidance
- Suggest when to seek immediate medical attention
- Provide preventive health tips
- Answer common health queries in simple language
- ALWAYS recommend consulting a qualified doctor for diagnosis
- NEVER prescribe specific medications
- If symptoms indicate emergency, clearly state "EMERGENCY: Please call emergency services immediately"`;

/**
 * Medical chatbot — sends conversation history to Gemini.
 * Falls back gracefully if GEMINI_API_KEY is not configured.
 * @param {Array} messages - [{role: 'user'|'assistant', content: string}]
 * @param {string} language - 'en' | 'hi'
 */
const chatWithAI = async (messages, language = 'en') => {
    if (!process.env.GEMINI_API_KEY) {
        return 'AI service is not configured. Please set the GEMINI_API_KEY in your .env file. In the meantime, please consult with your doctor directly.';
    }

    // Use gemini-flash-latest — confirmed available and working on this API key
    const model = getGenAI().getGenerativeModel({ model: 'gemini-flash-latest' });

    const langInstruction = language === 'hi' ? 'Respond in Hindi.' : 'Respond in English.';

    // Build Gemini-compatible history (all messages except the last one)
    const history = messages.slice(0, -1).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
        history: [
            { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n${langInstruction}` }] },
            { role: 'model', parts: [{ text: 'Understood. I am ready to assist patients with health queries.' }] },
            ...history,
        ],
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
};

/**
 * Generate symptom summary for doctor from chat session
 */
const generateSymptomSummary = async (messages) => {
    if (!process.env.GEMINI_API_KEY) {
        return 'AI summary unavailable — GEMINI_API_KEY not configured.';
    }
    const model = getGenAI().getGenerativeModel({ model: 'gemini-flash-latest' });
    const conversation = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
    const prompt = `Based on this patient-chatbot conversation, generate a concise medical summary for the doctor. Include: reported symptoms, duration, severity, relevant medical context. Keep it under 150 words.\n\nConversation:\n${conversation}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
};

/**
 * Enhance symptom analysis with AI suggestions
 */
const analyzeSymptoms = async (symptoms) => {
    if (!process.env.GEMINI_API_KEY) {
        return { suggestions: 'AI analysis unavailable. Please consult a doctor.', urgency: 'low', emergencyFlag: false };
    }
    const model = getGenAI().getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = `Patient has reported these symptoms: ${symptoms.join(', ')}. 
Provide a JSON response with:
{
  "suggestions": "brief health guidance text",
  "urgency": "low|medium|high|critical",
  "emergencyFlag": true/false,
  "emergencyReason": "reason if emergency"
}
Keep it concise and medically accurate.`;
    const result = await model.generateContent(prompt);
    try {
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { suggestions: text, urgency: 'low', emergencyFlag: false };
    } catch {
        return { suggestions: result.response.text(), urgency: 'low', emergencyFlag: false };
    }
};

module.exports = { chatWithAI, generateSymptomSummary, analyzeSymptoms };
