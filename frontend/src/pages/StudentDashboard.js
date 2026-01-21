import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import studentService from '../services/studentService';
import attendanceService from '../services/attendanceService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUser, FaChartBar, FaCalendarCheck, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [attendanceStats, setAttendanceStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);

            if (currentUser.studentId) {
                // Fetch student details
                const studentResponse = await studentService.getStudentByStudentId(currentUser.studentId);
                setStudentData(studentResponse.data);

                // Fetch attendance statistics
                const attendanceResponse = await attendanceService.getAttendanceStats(currentUser.studentId);
                setAttendanceStats(attendanceResponse.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    const COLORS = ['#4CAF50', '#f44336', '#FF9800', '#2196F3'];

    const attendanceData = attendanceStats?.overall ? [
        { name: 'Present', value: attendanceStats.overall.presentClasses },
        { name: 'Absent', value: attendanceStats.overall.absentClasses }
    ] : [];

    return (
        <div className="student-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Student Dashboard</h1>
                    <div className="header-actions">
                        <span className="user-name">
                            <FaUser /> {user?.name}
                        </span>
                        <button onClick={handleLogout} className="logout-btn">
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                {/* Student Info Card */}
                <div className="info-card">
                    <h2>Personal Information</h2>
                    {studentData && (
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Student ID:</label>
                                <span>{studentData.studentId}</span>
                            </div>
                            <div className="info-item">
                                <label>Name:</label>
                                <span>{`${studentData.personalInfo.firstName} ${studentData.personalInfo.lastName}`}</span>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <span>{studentData.personalInfo.email}</span>
                            </div>
                            <div className="info-item">
                                <label>Department:</label>
                                <span>{studentData.academicInfo.department}</span>
                            </div>
                            <div className="info-item">
                                <label>Year:</label>
                                <span>Year {studentData.academicInfo.currentYear}</span>
                            </div>
                            <div className="info-item">
                                <label>Semester:</label>
                                <span>Semester {studentData.academicInfo.currentSemester}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Attendance Overview */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#4CAF50' }}>
                            <FaCalendarCheck />
                        </div>
                        <div className="stat-info">
                            <h3>Overall Attendance</h3>
                            <p className="stat-value">{attendanceStats?.overall?.percentage || 0}%</p>
                            <p className="stat-detail">
                                {attendanceStats?.overall?.presentClasses || 0} / {attendanceStats?.overall?.totalClasses || 0} classes
                            </p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#2196F3' }}>
                            <FaChartBar />
                        </div>
                        <div className="stat-info">
                            <h3>Total Classes</h3>
                            <p className="stat-value">{attendanceStats?.overall?.totalClasses || 0}</p>
                            <p className="stat-detail">Across all subjects</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="charts-grid">
                    {/* Attendance Pie Chart */}
                    <div className="chart-card">
                        <h3>Attendance Distribution</h3>
                        {attendanceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={attendanceData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {attendanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="no-data">No attendance data available</p>
                        )}
                    </div>

                    {/* Subject-wise Attendance Bar Chart */}
                    <div className="chart-card">
                        <h3>Subject-wise Attendance</h3>
                        {attendanceStats?.subjectWise && attendanceStats.subjectWise.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={attendanceStats.subjectWise}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="subjectCode" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="percentage" fill="#667eea" name="Attendance %" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="no-data">No subject-wise data available</p>
                        )}
                    </div>
                </div>

                {/* Subject-wise Details Table */}
                {attendanceStats?.subjectWise && attendanceStats.subjectWise.length > 0 && (
                    <div className="table-card">
                        <h3>Subject-wise Attendance Details</h3>
                        <div className="table-responsive">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Subject Code</th>
                                        <th>Total Classes</th>
                                        <th>Present</th>
                                        <th>Absent</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceStats.subjectWise.map((subject, index) => (
                                        <tr key={index}>
                                            <td>{subject.subject}</td>
                                            <td>{subject.subjectCode}</td>
                                            <td>{subject.totalClasses}</td>
                                            <td className="present">{subject.presentClasses}</td>
                                            <td className="absent">{subject.absentClasses}</td>
                                            <td>
                                                <span className={`percentage ${subject.percentage >= 75 ? 'good' : 'low'}`}>
                                                    {subject.percentage}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <footer className="dashboard-footer">
                <p>Developed by Swastik Bhardwaj (Person A) - Smart Campus Management System</p>
            </footer>
        </div>
    );
};

export default StudentDashboard;
