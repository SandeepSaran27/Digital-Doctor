const { v4: uuidv4 } = require('uuid');

let appointmentCounter = 1;
let prescriptionCounter = 1;
let patientCounter = 1;

/**
 * Generate appointment ID: APT-YYYYMMDD-001
 */
const generateAppointmentId = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `APT-${date}-${String(appointmentCounter++).padStart(3, '0')}`;
};

/**
 * Generate prescription ID: RX-2024-0001
 */
const generatePrescriptionId = () => {
    const year = new Date().getFullYear();
    return `RX-${year}-${String(prescriptionCounter++).padStart(4, '0')}`;
};

/**
 * Generate patient ID: P-XXXXXX
 */
const generatePatientId = () => `P-${String(Date.now()).slice(-6)}`;

/**
 * Generate token number by counting today's appointments for a doctor
 * @param {Model} Appointment - mongoose model
 * @param {string} doctorId
 */
const generateToken = async (Appointment, doctorId, date) => {
    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end = new Date(date); end.setHours(23, 59, 59, 999);
    const count = await Appointment.countDocuments({ doctor: doctorId, date: { $gte: start, $lte: end } });
    return count + 1;
};

const generateSessionId = () => uuidv4();

module.exports = { generateAppointmentId, generatePrescriptionId, generatePatientId, generateToken, generateSessionId };
