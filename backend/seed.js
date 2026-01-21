const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./modules/auth/model');
const Student = require('./modules/students/model');
const Attendance = require('./modules/attendance/model');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const seedDatabase = async () => {
    try {
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Student.deleteMany({});
        await Attendance.deleteMany({});

        // Create Admin
        console.log('👤 Creating Admin user...');
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            department: 'Administration',
            isActive: true
        });

        // Create Faculty
        console.log('👨‍🏫 Creating Faculty users...');
        const faculty1 = await User.create({
            name: 'Dr. Rajesh Kumar',
            email: 'rajesh@example.com',
            password: 'faculty123',
            role: 'faculty',
            employeeId: 'FAC001',
            department: 'Computer Science',
            isActive: true
        });

        const faculty2 = await User.create({
            name: 'Prof. Priya Sharma',
            email: 'priya.sharma@example.com',
            password: 'faculty123',
            role: 'faculty',
            employeeId: 'FAC002',
            department: 'Electronics',
            isActive: true
        });

        // Create Students
        console.log('👨‍🎓 Creating Student users and records...');
        const studentsData = [
            {
                studentId: 'STU001',
                personalInfo: {
                    firstName: 'Amit',
                    lastName: 'Verma',
                    dateOfBirth: new Date('2003-05-15'),
                    gender: 'Male',
                    bloodGroup: 'O+',
                    email: 'amit.student@example.com',
                    phone: '9876543210',
                    address: {
                        city: 'Delhi',
                        state: 'Delhi',
                        pincode: '110001',
                        country: 'India'
                    }
                },
                academicInfo: {
                    enrollmentYear: 2022,
                    currentYear: 2,
                    currentSemester: 4,
                    department: 'Computer Science',
                    course: 'B.Tech',
                    rollNumber: 'CS2022001',
                    section: 'A'
                },
                guardianInfo: {
                    fatherName: 'Ramesh Verma',
                    motherName: 'Sunita Verma'
                },
                status: 'Active',
                createdBy: admin._id
            },
            {
                studentId: 'STU002',
                personalInfo: {
                    firstName: 'Priya',
                    lastName: 'Singh',
                    dateOfBirth: new Date('2003-08-22'),
                    gender: 'Female',
                    bloodGroup: 'A+',
                    email: 'priya.student@example.com',
                    phone: '9876543211',
                    address: {
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        pincode: '400001',
                        country: 'India'
                    }
                },
                academicInfo: {
                    enrollmentYear: 2022,
                    currentYear: 2,
                    currentSemester: 4,
                    department: 'Computer Science',
                    course: 'B.Tech',
                    rollNumber: 'CS2022002',
                    section: 'A'
                },
                guardianInfo: {
                    fatherName: 'Vikram Singh',
                    motherName: 'Anjali Singh'
                },
                status: 'Active',
                createdBy: admin._id
            },
            {
                studentId: 'STU003',
                personalInfo: {
                    firstName: 'Rahul',
                    lastName: 'Patel',
                    dateOfBirth: new Date('2003-03-10'),
                    gender: 'Male',
                    bloodGroup: 'B+',
                    email: 'rahul.student@example.com',
                    phone: '9876543212',
                    address: {
                        city: 'Ahmedabad',
                        state: 'Gujarat',
                        pincode: '380001',
                        country: 'India'
                    }
                },
                academicInfo: {
                    enrollmentYear: 2022,
                    currentYear: 2,
                    currentSemester: 4,
                    department: 'Electronics',
                    course: 'B.Tech',
                    rollNumber: 'EC2022001',
                    section: 'A'
                },
                guardianInfo: {
                    fatherName: 'Mahesh Patel',
                    motherName: 'Kavita Patel'
                },
                status: 'Active',
                createdBy: admin._id
            },
            {
                studentId: 'STU004',
                personalInfo: {
                    firstName: 'Sneha',
                    lastName: 'Reddy',
                    dateOfBirth: new Date('2003-11-05'),
                    gender: 'Female',
                    bloodGroup: 'AB+',
                    email: 'sneha.student@example.com',
                    phone: '9876543213',
                    address: {
                        city: 'Hyderabad',
                        state: 'Telangana',
                        pincode: '500001',
                        country: 'India'
                    }
                },
                academicInfo: {
                    enrollmentYear: 2023,
                    currentYear: 1,
                    currentSemester: 2,
                    department: 'Computer Science',
                    course: 'B.Tech',
                    rollNumber: 'CS2023001',
                    section: 'B'
                },
                guardianInfo: {
                    fatherName: 'Suresh Reddy',
                    motherName: 'Lakshmi Reddy'
                },
                status: 'Active',
                createdBy: admin._id
            },
            {
                studentId: 'STU005',
                personalInfo: {
                    firstName: 'Arjun',
                    lastName: 'Nair',
                    dateOfBirth: new Date('2002-12-20'),
                    gender: 'Male',
                    bloodGroup: 'O-',
                    email: 'arjun.student@example.com',
                    phone: '9876543214',
                    address: {
                        city: 'Kochi',
                        state: 'Kerala',
                        pincode: '682001',
                        country: 'India'
                    }
                },
                academicInfo: {
                    enrollmentYear: 2021,
                    currentYear: 3,
                    currentSemester: 6,
                    department: 'Electronics',
                    course: 'B.Tech',
                    rollNumber: 'EC2021001',
                    section: 'A'
                },
                guardianInfo: {
                    fatherName: 'Krishnan Nair',
                    motherName: 'Radha Nair'
                },
                status: 'Active',
                createdBy: admin._id
            }
        ];

        const students = await Student.insertMany(studentsData);

        // Create user accounts for students
        for (let i = 0; i < students.length; i++) {
            await User.create({
                name: `${students[i].personalInfo.firstName} ${students[i].personalInfo.lastName}`,
                email: students[i].personalInfo.email,
                password: students[i].studentId.toLowerCase(),
                role: 'student',
                studentId: students[i].studentId,
                department: students[i].academicInfo.department,
                isActive: true
            });
        }

        // Create Attendance Records
        console.log('📅 Creating attendance records...');
        const subjects = [
            { name: 'Data Structures', code: 'CS301' },
            { name: 'Database Management', code: 'CS302' },
            { name: 'Operating Systems', code: 'CS303' },
            { name: 'Computer Networks', code: 'CS304' },
            { name: 'Digital Electronics', code: 'EC301' }
        ];

        const attendanceRecords = [];
        const today = new Date();

        // Generate attendance for last 30 days
        for (let day = 0; day < 30; day++) {
            const date = new Date(today);
            date.setDate(date.getDate() - day);

            // Skip weekends
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            for (const student of students) {
                // Select subjects based on department
                const relevantSubjects = student.academicInfo.department === 'Computer Science'
                    ? subjects.slice(0, 4)
                    : [subjects[4]];

                for (const subject of relevantSubjects) {
                    // Random attendance with 70-90% presence
                    const isPresent = Math.random() > 0.2;

                    attendanceRecords.push({
                        student: student._id,
                        studentId: student.studentId,
                        subject: subject.name,
                        subjectCode: subject.code,
                        faculty: student.academicInfo.department === 'Computer Science' ? faculty1._id : faculty2._id,
                        date: date,
                        status: isPresent ? 'Present' : 'Absent',
                        session: 'Full Day',
                        academicInfo: {
                            year: student.academicInfo.currentYear,
                            semester: student.academicInfo.currentSemester,
                            department: student.academicInfo.department,
                            section: student.academicInfo.section
                        },
                        markedBy: student.academicInfo.department === 'Computer Science' ? faculty1._id : faculty2._id
                    });
                }
            }
        }

        await Attendance.insertMany(attendanceRecords);

        console.log('✅ Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Admin: 1`);
        console.log(`   - Faculty: 2`);
        console.log(`   - Students: ${students.length}`);
        console.log(`   - Attendance Records: ${attendanceRecords.length}`);
        console.log('\n🔑 Login Credentials:');
        console.log('   Admin: admin@example.com / admin123');
        console.log('   Faculty: rajesh@example.com / faculty123');
        console.log('   Student: amit.student@example.com / stu001');
        console.log('   Student: priya.student@example.com / stu002');

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
