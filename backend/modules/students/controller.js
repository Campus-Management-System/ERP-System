const Student = require('./model');
const User = require('../auth/model');
const csv = require('csv-parser');
const fs = require('fs');

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Private (Admin, Faculty)
 */
exports.getAllStudents = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            department,
            year,
            semester,
            status,
            search
        } = req.query;

        // Build query
        const query = {};

        if (department) query['academicInfo.department'] = department;
        if (year) query['academicInfo.currentYear'] = parseInt(year);
        if (semester) query['academicInfo.currentSemester'] = parseInt(semester);
        if (status) query.status = status;

        if (search) {
            query.$or = [
                { studentId: { $regex: search, $options: 'i' } },
                { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
                { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
                { 'personalInfo.email': { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const students = await Student.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Student.countDocuments(query);

        res.status(200).json({
            success: true,
            data: students,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalStudents: count,
                studentsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get All Students Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching students'
        });
    }
};

/**
 * @desc    Get student by ID
 * @route   GET /api/students/:id
 * @access  Private
 */
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Get Student Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student'
        });
    }
};

/**
 * @desc    Get student by student ID
 * @route   GET /api/students/studentId/:studentId
 * @access  Private
 */
exports.getStudentByStudentId = async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.studentId });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Get Student Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student'
        });
    }
};

/**
 * @desc    Create new student
 * @route   POST /api/students
 * @access  Private (Admin)
 */
exports.createStudent = async (req, res) => {
    try {
        const studentData = req.body;

        // Check if student ID already exists
        const existingStudent = await Student.findOne({ studentId: studentData.studentId });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student with this ID already exists'
            });
        }

        // Create student
        studentData.createdBy = req.user.id;
        const student = await Student.create(studentData);

        // Optionally create user account for student
        if (studentData.createUserAccount) {
            try {
                await User.create({
                    name: `${studentData.personalInfo.firstName} ${studentData.personalInfo.lastName}`,
                    email: studentData.personalInfo.email,
                    password: studentData.studentId, // Default password is student ID
                    role: 'student',
                    studentId: studentData.studentId,
                    department: studentData.academicInfo.department
                });
            } catch (userError) {
                console.error('User creation error:', userError);
                // Continue even if user creation fails
            }
        }

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });
    } catch (error) {
        console.error('Create Student Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating student'
        });
    }
};

/**
 * @desc    Update student
 * @route   PUT /api/students/:id
 * @access  Private (Admin)
 */
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Update student
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user.id },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    } catch (error) {
        console.error('Update Student Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating student'
        });
    }
};

/**
 * @desc    Delete student
 * @route   DELETE /api/students/:id
 * @access  Private (Admin)
 */
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        await Student.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Delete Student Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting student'
        });
    }
};

/**
 * @desc    Upload students from CSV
 * @route   POST /api/students/upload-csv
 * @access  Private (Admin)
 */
exports.uploadStudentsCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a CSV file'
            });
        }

        const students = [];
        const errors = [];

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (row) => {
                try {
                    // Parse CSV row and create student object
                    const student = {
                        studentId: row.studentId,
                        personalInfo: {
                            firstName: row.firstName,
                            lastName: row.lastName,
                            dateOfBirth: new Date(row.dateOfBirth),
                            gender: row.gender,
                            email: row.email,
                            phone: row.phone,
                            address: {
                                city: row.city,
                                state: row.state,
                                pincode: row.pincode
                            }
                        },
                        academicInfo: {
                            enrollmentYear: parseInt(row.enrollmentYear),
                            currentYear: parseInt(row.currentYear),
                            currentSemester: parseInt(row.currentSemester),
                            department: row.department,
                            course: row.course,
                            rollNumber: row.rollNumber
                        },
                        guardianInfo: {
                            fatherName: row.fatherName,
                            motherName: row.motherName
                        },
                        createdBy: req.user.id
                    };
                    students.push(student);
                } catch (error) {
                    errors.push({ row, error: error.message });
                }
            })
            .on('end', async () => {
                try {
                    // Bulk insert students
                    const insertedStudents = await Student.insertMany(students, { ordered: false });

                    // Clean up uploaded file
                    fs.unlinkSync(req.file.path);

                    res.status(201).json({
                        success: true,
                        message: `Successfully uploaded ${insertedStudents.length} students`,
                        data: {
                            inserted: insertedStudents.length,
                            errors: errors.length
                        },
                        errors: errors.length > 0 ? errors : undefined
                    });
                } catch (error) {
                    console.error('Bulk Insert Error:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Error inserting students',
                        error: error.message
                    });
                }
            });
    } catch (error) {
        console.error('CSV Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing CSV file'
        });
    }
};

/**
 * @desc    Get student statistics
 * @route   GET /api/students/stats
 * @access  Private (Admin, Faculty)
 */
exports.getStudentStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const activeStudents = await Student.countDocuments({ status: 'Active' });

        const departmentStats = await Student.aggregate([
            { $group: { _id: '$academicInfo.department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const yearStats = await Student.aggregate([
            { $group: { _id: '$academicInfo.currentYear', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                activeStudents,
                departmentStats,
                yearStats
            }
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
};
