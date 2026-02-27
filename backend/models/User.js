const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User roles
const ROLES = ['admin', 'doctor', 'receptionist', 'patient'];

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, enum: ROLES, default: 'patient' },
        isActive: { type: Boolean, default: true },

        // Doctor-specific fields
        specialization: { type: String },
        licenseNumber: { type: String },
        consultationFee: { type: Number },
        availability: [
            {
                day: { type: String },          // e.g., 'Monday'
                startTime: { type: String },    // '09:00'
                endTime: { type: String },      // '17:00'
                isAvailable: { type: Boolean, default: true },
            },
        ],

        // Patient-specific fields
        patientId: { type: String, unique: true, sparse: true }, // auto-generated
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        bloodGroup: { type: String },
        address: { type: String },
        emergencyContact: {
            name: String,
            phone: String,
            relation: String,
        },

        // QR code for patient check-in
        qrCode: { type: String },

        profilePicture: { type: String },
        lastLogin: { type: Date },
        refreshToken: { type: String },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Hide password from responses
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
