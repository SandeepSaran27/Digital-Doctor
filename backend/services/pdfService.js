const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate prescription PDF
 * @returns {string} - saved file path
 */
const generatePrescriptionPDF = async (prescription, patient, doctor) => {
    return new Promise((resolve, reject) => {
        const dir = 'uploads/prescriptions';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const filename = `${prescription.prescriptionId || Date.now()}.pdf`;
        const filePath = path.join(dir, filename);
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // === HEADER ===
        doc.rect(0, 0, doc.page.width, 100).fill('#0ea5e9');
        doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text('Digital Doctor Clinic', 50, 30);
        doc.fontSize(10).font('Helvetica').text('Digital Health Records & Appointment System', 50, 58);
        doc.text('www.digitaldoctor.health | info@digitaldoctor.health', 50, 72);

        // === PRESCRIPTION TITLE ===
        doc.fillColor('#1e293b').fontSize(16).font('Helvetica-Bold').text('PRESCRIPTION', 50, 120);
        doc.fontSize(10).font('Helvetica').fillColor('#64748b')
            .text(`Rx ID: ${prescription.prescriptionId}`, 50, 142)
            .text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, 300, 142);

        // === DIVIDER ===
        doc.moveTo(50, 160).lineTo(550, 160).strokeColor('#e2e8f0').lineWidth(1).stroke();

        // === PATIENT INFO ===
        doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('Patient Information', 50, 175);
        doc.fontSize(10).font('Helvetica').fillColor('#334155')
            .text(`Name: ${patient.name}`, 50, 195)
            .text(`Phone: ${patient.phone}`, 50, 210)
            .text(`Patient ID: ${patient.patientId || 'N/A'}`, 50, 225)
            .text(`Diagnosis: ${prescription.diagnosis}`, 50, 240);

        // === DOCTOR INFO ===
        doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('Prescribing Doctor', 300, 175);
        doc.fontSize(10).font('Helvetica').fillColor('#334155')
            .text(`Dr. ${doctor.name}`, 300, 195)
            .text(`Specialization: ${doctor.specialization || 'General'}`, 300, 210)
            .text(`License: ${doctor.licenseNumber || 'N/A'}`, 300, 225);

        doc.moveTo(50, 265).lineTo(550, 265).strokeColor('#e2e8f0').lineWidth(1).stroke();

        // === MEDICINES ===
        doc.fillColor('#1e293b').fontSize(13).font('Helvetica-Bold').text('Medicines', 50, 280);
        let y = 300;
        (prescription.medicines || []).forEach((med, i) => {
            doc.rect(50, y - 5, 500, 50).fill(i % 2 === 0 ? '#f8fafc' : '#ffffff').stroke('#e2e8f0');
            doc.fillColor('#0ea5e9').fontSize(11).font('Helvetica-Bold').text(`${i + 1}. ${med.name}`, 60, y + 2);
            doc.fillColor('#334155').fontSize(9).font('Helvetica')
                .text(`Dosage: ${med.dosage || '-'}  |  Frequency: ${med.frequency || '-'}  |  Duration: ${med.duration || '-'}`, 60, y + 18)
                .text(`Instructions: ${med.instructions || 'As directed'}`, 60, y + 30);
            y += 58;
        });

        // === INSTRUCTIONS ===
        if (prescription.instructions) {
            y += 10;
            doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('General Instructions', 50, y);
            doc.fontSize(10).font('Helvetica').fillColor('#334155').text(prescription.instructions, 50, y + 18, { width: 500 });
            y += 40;
        }

        // === FOLLOW-UP ===
        if (prescription.followUpDate) {
            doc.fillColor('#0ea5e9').fontSize(11).font('Helvetica-Bold')
                .text(`Follow-up Date: ${new Date(prescription.followUpDate).toLocaleDateString()}`, 50, y + 20);
        }

        // === QR CODE SECTION ===
        doc.moveTo(50, doc.page.height - 120).lineTo(550, doc.page.height - 120).strokeColor('#e2e8f0').stroke();
        doc.fillColor('#64748b').fontSize(8).font('Helvetica')
            .text(`Verification QR: ${prescription.qrHash}`, 50, doc.page.height - 105)
            .text('Scan QR code to verify prescription authenticity.', 50, doc.page.height - 92)
            .text('This is a digitally generated prescription. Valid only with doctor\'s digital signature.', 50, doc.page.height - 78);

        // === DOCTOR SIGNATURE LINE ===
        doc.moveTo(380, doc.page.height - 80).lineTo(540, doc.page.height - 80).strokeColor('#334155').stroke();
        doc.fillColor('#334155').fontSize(9).text(`Dr. ${doctor.name}`, 380, doc.page.height - 68).text('Signature', 400, doc.page.height - 56);

        doc.end();
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};

module.exports = { generatePrescriptionPDF };
