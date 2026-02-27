// SMS Service using Twilio (optional - gracefully skips if not configured)
let twilioClient;
const getTwilio = () => {
    if (!twilioClient && process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
        const twilio = require('twilio');
        twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    }
    return twilioClient;
};

const sendSMS = async ({ to, message }) => {
    const client = getTwilio();
    if (!client) {
        console.log('⚠️  SMS skipped: Twilio not configured');
        return null;
    }
    try {
        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to,
        });
        console.log(`📱 SMS sent to ${to}: ${result.sid}`);
        return result;
    } catch (error) {
        console.error('SMS error:', error.message);
        return null;
    }
};

const sendAppointmentSMS = async ({ to, patientName, date, timeSlot, tokenNumber }) => {
    const message = `Hi ${patientName}, your appointment is on ${new Date(date).toLocaleDateString()} at ${timeSlot}. Token #${tokenNumber}. - Digital Doctor Clinic`;
    return sendSMS({ to, message });
};

const sendEmergencySMS = async ({ to, patientName }) => {
    const message = `🚨 EMERGENCY ALERT: Patient ${patientName} requires immediate attention. Please respond urgently. - Digital Doctor Clinic`;
    return sendSMS({ to, message });
};

module.exports = { sendSMS, sendAppointmentSMS, sendEmergencySMS };
