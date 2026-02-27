/**
 * Digital Doctor — Seed Data
 * Run: npm run seed
 * Creates sample admin, doctor, receptionist, patient accounts + appointments + prescriptions
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const connectDB = require('../config/db');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// ─── Helpers ──────────────────────────────────────────────────────────────
const hash = (pw) => bcrypt.hashSync(pw, 10);

// ─── Seed Users ───────────────────────────────────────────────────────────
const usersData = [
    {
        name: 'Dr. Admin Singh',
        email: 'admin@digitaldoctor.com',
        password: hash('Admin@1234'),
        role: 'admin',
        phone: '9000000001',
        isActive: true,
    },
    {
        name: 'Dr. Rajesh Kumar',
        email: 'doctor@digitaldoctor.com',
        password: hash('Doctor@1234'),
        role: 'doctor',
        phone: '9000000002',
        specialization: 'General Medicine',
        qualification: 'MBBS, MD',
        registrationNumber: 'RMP-2024-001',
        isActive: true,
        availability: {
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            startTime: '09:00',
            endTime: '17:00',
            slotDurationMinutes: 15,
        },
    },
    {
        name: 'Dr. Priya Sharma',
        email: 'doctor2@digitaldoctor.com',
        password: hash('Doctor@1234'),
        role: 'doctor',
        phone: '9000000003',
        specialization: 'Paediatrics',
        qualification: 'MBBS, DCH',
        registrationNumber: 'RMP-2024-002',
        isActive: true,
        availability: {
            workingDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
            startTime: '10:00',
            endTime: '16:00',
            slotDurationMinutes: 20,
        },
    },
    {
        name: 'Anita Verma',
        email: 'receptionist@digitaldoctor.com',
        password: hash('Recept@1234'),
        role: 'receptionist',
        phone: '9000000004',
        isActive: true,
    },
    {
        name: 'Mohan Das',
        email: 'patient@digitaldoctor.com',
        password: hash('Patient@1234'),
        role: 'patient',
        phone: '9000000005',
        isActive: true,
    },
    {
        name: 'Savitri Devi',
        email: 'patient2@digitaldoctor.com',
        password: hash('Patient@1234'),
        role: 'patient',
        phone: '9000000006',
        isActive: true,
    },
];

// ─── Seed Patients ────────────────────────────────────────────────────────
const buildPatientsData = (userMap) => [
    {
        userId: userMap['patient@digitaldoctor.com'],
        firstName: 'Mohan',
        lastName: 'Das',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'male',
        phone: '9000000005',
        email: 'patient@digitaldoctor.com',
        address: {
            street: '12, Main Road',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302001',
        },
        bloodGroup: 'B+',
        emergencyContact: {
            name: 'Kamla Das',
            relationship: 'Wife',
            phone: '9100000001',
        },
        medicalHistory: {
            allergies: ['Penicillin'],
            chronicConditions: ['Hypertension'],
            currentMedications: ['Amlodipine 5mg'],
            surgeries: [],
            familyHistory: ['Diabetes — Father'],
        },
        visits: [
            {
                date: new Date('2024-11-10'),
                chiefComplaint: 'Persistent headache and dizziness',
                diagnosis: 'Hypertension — Stage 1',
                notes: 'BP 150/95. Lifestyle changes advised.',
            },
            {
                date: new Date('2025-01-20'),
                chiefComplaint: 'Follow-up for hypertension',
                diagnosis: 'Hypertension — controlled',
                notes: 'BP 130/85. Continue same medication.',
            },
        ],
        isActive: true,
    },
    {
        userId: userMap['patient2@digitaldoctor.com'],
        firstName: 'Savitri',
        lastName: 'Devi',
        dateOfBirth: new Date('1972-03-22'),
        gender: 'female',
        phone: '9000000006',
        email: 'patient2@digitaldoctor.com',
        address: {
            street: '8, Station Road',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302002',
        },
        bloodGroup: 'O+',
        emergencyContact: {
            name: 'Ram Prasad',
            relationship: 'Husband',
            phone: '9100000002',
        },
        medicalHistory: {
            allergies: [],
            chronicConditions: ['Type 2 Diabetes'],
            currentMedications: ['Metformin 500mg', 'Glimepiride 1mg'],
            surgeries: ['Appendectomy — 2005'],
            familyHistory: ['Diabetes — Mother', 'Heart disease — Father'],
        },
        visits: [
            {
                date: new Date('2025-02-01'),
                chiefComplaint: 'High blood sugar, fatigue',
                diagnosis: 'Type 2 Diabetes — uncontrolled',
                notes: 'HbA1c 9.2%. Medication adjusted.',
            },
        ],
        isActive: true,
    },
];

// ─── Seed Appointments ────────────────────────────────────────────────────
const buildAppointmentsData = (doctorId, patientIds) => [
    {
        patient: patientIds[0],
        doctor: doctorId,
        appointmentDate: new Date('2025-03-01T10:00:00'),
        tokenNumber: 1,
        type: 'walkin',
        status: 'completed',
        chiefComplaint: 'Routine check-up',
        consultationNotes: 'BP normal. Continue medication.',
    },
    {
        patient: patientIds[1],
        doctor: doctorId,
        appointmentDate: new Date('2025-03-01T10:15:00'),
        tokenNumber: 2,
        type: 'walkin',
        status: 'completed',
        chiefComplaint: 'Diabetes follow-up',
        consultationNotes: 'Blood sugar improving. Review in 1 month.',
    },
    {
        patient: patientIds[0],
        doctor: doctorId,
        appointmentDate: new Date(), // today
        tokenNumber: 3,
        type: 'walkin',
        status: 'waiting',
        chiefComplaint: 'Headache since 2 days',
    },
    {
        patient: patientIds[1],
        doctor: doctorId,
        appointmentDate: new Date(Date.now() + 30 * 60 * 1000), // 30 min from now
        tokenNumber: 4,
        type: 'online',
        status: 'waiting',
        chiefComplaint: 'Fatigue and weakness',
    },
];

// ─── Seed Prescriptions ───────────────────────────────────────────────────
const buildPrescriptionsData = (doctorId, patient1Id, appointment1Id) => [
    {
        patient: patient1Id,
        doctor: doctorId,
        appointment: appointment1Id,
        medicines: [
            {
                name: 'Amlodipine',
                dosage: '5mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take in the morning after breakfast',
            },
            {
                name: 'Aspirin',
                dosage: '75mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take at night after food',
            },
        ],
        instructions: 'Reduce salt intake. Exercise 30 min daily. Monitor BP at home.',
        followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        diagnosis: 'Hypertension — Stage 1',
    },
];

// ─── Main Seeder ──────────────────────────────────────────────────────────
const seed = async () => {
    try {
        await connectDB();
        console.log('\n🌱  Starting seed process...\n');

        // Clear existing data
        await User.deleteMany({});
        await Patient.deleteMany({});
        await Appointment.deleteMany({});
        await Prescription.deleteMany({});
        console.log('✓  Cleared existing data');

        // Insert users
        const users = await User.insertMany(usersData);
        const userMap = {};
        users.forEach((u) => { userMap[u.email] = u._id; });
        console.log(`✓  Inserted ${users.length} users`);

        // Insert patients
        const patientsData = buildPatientsData(userMap);
        const patients = await Patient.insertMany(patientsData);
        const patientIds = patients.map((p) => p._id);
        console.log(`✓  Inserted ${patients.length} patients`);

        // Insert appointments
        const doctorId = userMap['doctor@digitaldoctor.com'];
        const appointmentsData = buildAppointmentsData(doctorId, patientIds);
        const appointments = await Appointment.insertMany(appointmentsData);
        console.log(`✓  Inserted ${appointments.length} appointments`);

        // Insert prescriptions
        const prescriptionsData = buildPrescriptionsData(doctorId, patientIds[0], appointments[0]._id);
        const prescriptions = await Prescription.insertMany(prescriptionsData);
        console.log(`✓  Inserted ${prescriptions.length} prescriptions`);

        console.log('\n✅  Seed completed successfully!\n');
        console.log('─────────────────────────────────────────────');
        console.log('  Test Accounts');
        console.log('─────────────────────────────────────────────');
        console.log('  Admin       : admin@digitaldoctor.com       / Admin@1234');
        console.log('  Doctor 1    : doctor@digitaldoctor.com      / Doctor@1234');
        console.log('  Doctor 2    : doctor2@digitaldoctor.com     / Doctor@1234');
        console.log('  Receptionist: receptionist@digitaldoctor.com/ Recept@1234');
        console.log('  Patient 1   : patient@digitaldoctor.com     / Patient@1234');
        console.log('  Patient 2   : patient2@digitaldoctor.com    / Patient@1234');
        console.log('─────────────────────────────────────────────\n');

        process.exit(0);
    } catch (error) {
        console.error('❌  Seed failed:', error);
        process.exit(1);
    }
};

seed();
