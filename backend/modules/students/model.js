const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    personalInfo: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true
        },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true
        },
        alternatePhone: String,
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: {
                type: String,
                default: 'India'
            }
        }
    },
    academicInfo: {
        enrollmentYear: {
            type: Number,
            required: true
        },
        currentYear: {
            type: Number,
            required: true,
            min: 1,
            max: 4
        },
        currentSemester: {
            type: Number,
            required: true,
            min: 1,
            max: 8
        },
        department: {
            type: String,
            required: true
        },
        course: {
            type: String,
            required: true
        },
        section: {
            type: String,
            default: 'A'
        },
        rollNumber: {
            type: String,
            required: true
        },
        admissionType: {
            type: String,
            enum: ['Regular', 'Lateral Entry', 'Transfer'],
            default: 'Regular'
        }
    },
    guardianInfo: {
        fatherName: {
            type: String,
            required: true
        },
        fatherOccupation: String,
        fatherPhone: String,
        motherName: {
            type: String,
            required: true
        },
        motherOccupation: String,
        motherPhone: String,
        guardianName: String,
        guardianRelation: String,
        guardianPhone: String
    },
    documents: {
        photo: String,
        aadharCard: String,
        tenthMarksheet: String,
        twelfthMarksheet: String,
        transferCertificate: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended', 'Graduated', 'Dropped'],
        default: 'Active'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes for faster queries
studentSchema.index({ studentId: 1 });
studentSchema.index({ 'personalInfo.email': 1 });
studentSchema.index({ 'academicInfo.department': 1 });
studentSchema.index({ 'academicInfo.currentYear': 1 });
studentSchema.index({ status: 1 });

// Virtual for full name
studentSchema.virtual('fullName').get(function () {
    return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Method to get student summary
studentSchema.methods.getSummary = function () {
    return {
        studentId: this.studentId,
        name: `${this.personalInfo.firstName} ${this.personalInfo.lastName}`,
        email: this.personalInfo.email,
        department: this.academicInfo.department,
        year: this.academicInfo.currentYear,
        semester: this.academicInfo.currentSemester,
        status: this.status
    };
};

module.exports = mongoose.model('Student', studentSchema);
