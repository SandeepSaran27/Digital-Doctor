const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload dirs exist
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
ensureDir('uploads/lab-reports');
ensureDir('uploads/prescriptions');
ensureDir('uploads/profiles');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = req.uploadDest || 'uploads/lab-reports';
        ensureDir(dest);
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error('File type not allowed'), false);
};

const maxSize = (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024;

const upload = multer({ storage, fileFilter, limits: { fileSize: maxSize } });

module.exports = upload;
