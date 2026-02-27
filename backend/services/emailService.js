const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send a generic email
 */
const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            html,
            text,
        });
        console.log(`✉️  Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Email send error:', error.message);
        throw error;
    }
};

/**
 * Appointment reminder email
 */
const sendAppointmentReminder = async ({ patientEmail, patientName, doctorName, date, timeSlot, tokenNumber }) => {
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#0ea5e9;padding:20px;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;">🏥 Appointment Reminder</h1>
      </div>
      <div style="padding:20px;background:#f8fafc;border-radius:0 0 8px 8px;">
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>This is a reminder for your upcoming appointment.</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#fff;"><strong>Doctor</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${doctorName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#fff;"><strong>Date</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${new Date(date).toLocaleDateString()}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#fff;"><strong>Time Slot</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${timeSlot}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#fff;"><strong>Token #</strong></td><td style="padding:8px;border:1px solid #e2e8f0;"><strong style="color:#0ea5e9;">${tokenNumber}</strong></td></tr>
        </table>
        <p style="margin-top:20px;">Please arrive 10 minutes before your appointment. Bring any previous medical records.</p>
        <p style="color:#64748b;font-size:12px;">Digital Doctor Clinic Management System</p>
      </div>
    </div>`;

    return sendEmail({ to: patientEmail, subject: '🏥 Appointment Reminder - Digital Doctor', html });
};

/**
 * Emergency notification email
 */
const sendEmergencyAlert = async ({ to, patientName, patientId, description, medicalHistory }) => {
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#ef4444;padding:20px;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;">🚨 EMERGENCY ALERT</h1>
      </div>
      <div style="padding:20px;background:#fef2f2;border-radius:0 0 8px 8px;">
        <p><strong>Patient:</strong> ${patientName} (ID: ${patientId})</p>
        <p><strong>Emergency Description:</strong> ${description}</p>
        <p><strong>Medical History Summary:</strong></p>
        <pre style="background:#fff;padding:10px;border-radius:4px;border:1px solid #fca5a5;">${medicalHistory || 'No history on record'}</pre>
        <p style="color:#ef4444;font-weight:bold;">Please respond immediately!</p>
      </div>
    </div>`;

    return sendEmail({ to, subject: '🚨 EMERGENCY ALERT - Digital Doctor', html });
};

module.exports = { sendEmail, sendAppointmentReminder, sendEmergencyAlert };
