const Attendance = require('./model');
const Student = require('../students/model');

/**
 * @desc    Mark attendance for students
 * @route   POST /api/attendance/mark
 * @access  Private (Faculty, Admin)
 */
exports.markAttendance = async (req, res) => {
    try {
        const { attendanceRecords } = req.body;

        if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide attendance records array'
            });
        }

        const results = [];
        const errors = [];

        for (const record of attendanceRecords) {
            try {
                // Check if student exists
                const student = await Student.findOne({ studentId: record.studentId });
                if (!student) {
                    errors.push({
                        studentId: record.studentId,
                        error: 'Student not found'
                    });
                    continue;
                }

                // Check if attendance already marked
                const existingAttendance = await Attendance.findOne({
                    student: student._id,
                    subject: record.subject,
                    date: new Date(record.date),
                    session: record.session || 'Full Day'
                });

                if (existingAttendance) {
                    errors.push({
                        studentId: record.studentId,
                        error: 'Attendance already marked for this session'
                    });
                    continue;
                }

                // Create attendance record
                const attendance = await Attendance.create({
                    student: student._id,
                    studentId: record.studentId,
                    subject: record.subject,
                    subjectCode: record.subjectCode,
                    faculty: req.user.id,
                    date: new Date(record.date),
                    status: record.status,
                    session: record.session || 'Full Day',
                    academicInfo: {
                        year: student.academicInfo.currentYear,
                        semester: student.academicInfo.currentSemester,
                        department: student.academicInfo.department,
                        section: student.academicInfo.section
                    },
                    remarks: record.remarks,
                    markedBy: req.user.id
                });

                results.push(attendance);
            } catch (error) {
                errors.push({
                    studentId: record.studentId,
                    error: error.message
                });
            }
        }

        res.status(201).json({
            success: true,
            message: `Attendance marked for ${results.length} students`,
            data: {
                marked: results.length,
                errors: errors.length
            },
            results,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Mark Attendance Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking attendance'
        });
    }
};

/**
 * @desc    Update attendance record
 * @route   PUT /api/attendance/:id
 * @access  Private (Faculty, Admin)
 */
exports.updateAttendance = async (req, res) => {
    try {
        const { status, remarks } = req.body;

        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        // Update fields
        if (status) attendance.status = status;
        if (remarks !== undefined) attendance.remarks = remarks;
        attendance.updatedBy = req.user.id;

        await attendance.save();

        res.status(200).json({
            success: true,
            message: 'Attendance updated successfully',
            data: attendance
        });
    } catch (error) {
        console.error('Update Attendance Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating attendance'
        });
    }
};

/**
 * @desc    Get attendance by student
 * @route   GET /api/attendance/student/:studentId
 * @access  Private
 */
exports.getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { subject, startDate, endDate } = req.query;

        const query = { studentId };

        if (subject) {
            query.subject = subject;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const attendance = await Attendance.find(query)
            .populate('faculty', 'name email')
            .sort({ date: -1 });

        // Calculate attendance percentage
        const stats = await Attendance.calculateAttendancePercentage(studentId, subject);

        res.status(200).json({
            success: true,
            data: {
                attendance,
                statistics: stats
            }
        });
    } catch (error) {
        console.error('Get Attendance Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance'
        });
    }
};

/**
 * @desc    Get attendance by subject
 * @route   GET /api/attendance/subject/:subjectCode
 * @access  Private (Faculty, Admin)
 */
exports.getAttendanceBySubject = async (req, res) => {
    try {
        const { subjectCode } = req.params;
        const { date, year, semester, department } = req.query;

        const query = { subjectCode };

        if (date) {
            query.date = new Date(date);
        }

        if (year) query['academicInfo.year'] = parseInt(year);
        if (semester) query['academicInfo.semester'] = parseInt(semester);
        if (department) query['academicInfo.department'] = department;

        const attendance = await Attendance.find(query)
            .populate('student', 'studentId personalInfo.firstName personalInfo.lastName')
            .sort({ date: -1, studentId: 1 });

        res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        console.error('Get Attendance Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance'
        });
    }
};

/**
 * @desc    Get attendance by date
 * @route   GET /api/attendance/date/:date
 * @access  Private (Faculty, Admin)
 */
exports.getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const { subject, department, year } = req.query;

        const query = { date: new Date(date) };

        if (subject) query.subject = subject;
        if (department) query['academicInfo.department'] = department;
        if (year) query['academicInfo.year'] = parseInt(year);

        const attendance = await Attendance.find(query)
            .populate('student', 'studentId personalInfo.firstName personalInfo.lastName')
            .populate('faculty', 'name email')
            .sort({ studentId: 1 });

        res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        console.error('Get Attendance Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance'
        });
    }
};

/**
 * @desc    Get attendance statistics
 * @route   GET /api/attendance/stats/:studentId
 * @access  Private
 */
exports.getAttendanceStats = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Overall attendance
        const overallStats = await Attendance.calculateAttendancePercentage(studentId);

        // Subject-wise attendance
        const subjects = await Attendance.distinct('subjectCode', { studentId });
        const subjectWiseStats = [];

        for (const subjectCode of subjects) {
            const stats = await Attendance.calculateAttendancePercentage(studentId, subjectCode);
            const subjectInfo = await Attendance.findOne({ studentId, subjectCode }).select('subject subjectCode');

            subjectWiseStats.push({
                subject: subjectInfo.subject,
                subjectCode: subjectInfo.subjectCode,
                ...stats
            });
        }

        // Monthly attendance trend
        const monthlyStats = await Attendance.aggregate([
            { $match: { studentId } },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: 1 },
                    present: {
                        $sum: {
                            $cond: [{ $in: ['$status', ['Present', 'Late']] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overall: overallStats,
                subjectWise: subjectWiseStats,
                monthlyTrend: monthlyStats
            }
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance statistics'
        });
    }
};

/**
 * @desc    Delete attendance record
 * @route   DELETE /api/attendance/:id
 * @access  Private (Admin)
 */
exports.deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        await Attendance.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Attendance record deleted successfully'
        });
    } catch (error) {
        console.error('Delete Attendance Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting attendance'
        });
    }
};

/**
 * @desc    Get low attendance students
 * @route   GET /api/attendance/low-attendance
 * @access  Private (Faculty, Admin)
 */
exports.getLowAttendanceStudents = async (req, res) => {
    try {
        const { threshold = 75, department, year } = req.query;

        // Get all students
        const query = {};
        if (department) query['academicInfo.department'] = department;
        if (year) query['academicInfo.currentYear'] = parseInt(year);

        const students = await Student.find(query).select('studentId personalInfo academicInfo');

        const lowAttendanceStudents = [];

        for (const student of students) {
            const stats = await Attendance.calculateAttendancePercentage(student.studentId);

            if (stats.percentage < threshold && stats.totalClasses > 0) {
                lowAttendanceStudents.push({
                    student: {
                        studentId: student.studentId,
                        name: `${student.personalInfo.firstName} ${student.personalInfo.lastName}`,
                        department: student.academicInfo.department,
                        year: student.academicInfo.currentYear
                    },
                    attendance: stats
                });
            }
        }

        // Sort by attendance percentage
        lowAttendanceStudents.sort((a, b) => a.attendance.percentage - b.attendance.percentage);

        res.status(200).json({
            success: true,
            data: lowAttendanceStudents,
            count: lowAttendanceStudents.length
        });
    } catch (error) {
        console.error('Get Low Attendance Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching low attendance students'
        });
    }
};
