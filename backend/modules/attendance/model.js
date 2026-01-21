const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    subjectCode: {
        type: String,
        required: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Excused'],
        required: true
    },
    session: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Full Day'],
        default: 'Full Day'
    },
    academicInfo: {
        year: {
            type: Number,
            required: true
        },
        semester: {
            type: Number,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        section: {
            type: String,
            default: 'A'
        }
    },
    remarks: {
        type: String,
        trim: true
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate attendance entries
attendanceSchema.index({ student: 1, subject: 1, date: 1, session: 1 }, { unique: true });

// Indexes for faster queries
attendanceSchema.index({ studentId: 1, date: -1 });
attendanceSchema.index({ subject: 1, date: -1 });
attendanceSchema.index({ 'academicInfo.department': 1, 'academicInfo.year': 1 });
attendanceSchema.index({ date: -1 });

// Static method to calculate attendance percentage
attendanceSchema.statics.calculateAttendancePercentage = async function (studentId, subjectCode = null) {
    const query = { studentId };
    if (subjectCode) {
        query.subjectCode = subjectCode;
    }

    const totalClasses = await this.countDocuments(query);
    const presentClasses = await this.countDocuments({
        ...query,
        status: { $in: ['Present', 'Late'] }
    });

    const percentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

    return {
        totalClasses,
        presentClasses,
        absentClasses: totalClasses - presentClasses,
        percentage: parseFloat(percentage.toFixed(2))
    };
};

// Method to get attendance summary
attendanceSchema.methods.getSummary = function () {
    return {
        date: this.date,
        subject: this.subject,
        status: this.status,
        session: this.session,
        remarks: this.remarks
    };
};

module.exports = mongoose.model('Attendance', attendanceSchema);
