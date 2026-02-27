const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * Generate QR code as base64 data URL
 * @param {string} data - string to encode in QR
 */
const generateQR = async (data) => {
    return QRCode.toDataURL(data, { width: 200, margin: 1, color: { dark: '#0ea5e9', light: '#ffffff' } });
};

/**
 * Generate a secure hash for prescription verification
 */
const generateVerificationHash = (prescriptionId, patientId, doctorId) => {
    return crypto
        .createHash('sha256')
        .update(`${prescriptionId}:${patientId}:${doctorId}:${Date.now()}`)
        .digest('hex')
        .slice(0, 32);
};

/**
 * Generate QR code for patient check-in
 */
const generatePatientQR = async (patientId, userId) => {
    const data = JSON.stringify({ type: 'patient-checkin', patientId, userId, ts: Date.now() });
    return generateQR(data);
};

module.exports = { generateQR, generateVerificationHash, generatePatientQR };
