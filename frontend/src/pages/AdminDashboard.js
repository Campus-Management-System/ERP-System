import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import studentService from '../services/studentService';
import attendanceService from '../services/attendanceService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaUser, FaUserGraduate, FaChartLine, FaSignOutAlt, FaUsers, FaCalendarCheck, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [lowAttendance, setLowAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);

            // Fetch student statistics
            const statsResponse = await studentService.getStats();
            setStats(statsResponse.data);

            // Fetch low attendance students
            const lowAttResponse = await attendanceService.getLowAttendanceStudents({ threshold: 75 });
            setLowAttendance(lowAttResponse.data);
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

    const navigateToStudents = () => {
        navigate('/admin/students');
    };

    const navigateToAttendance = () => {
        navigate('/admin/attendance');
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Admin Dashboard</h1>
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
                {/* Quick Stats */}
                <div className="stats-grid">
                    <div className="stat-card" onClick={navigateToStudents}>
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <FaUserGraduate />
                        </div>
                        <div className="stat-info">
                            <h3>Total Students</h3>
                            <p className="stat-value">{stats?.totalStudents || 0}</p>
                            <p className="stat-detail">Registered in system</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <FaUsers />
                        </div>
                        <div className="stat-info">
                            <h3>Active Students</h3>
                            <p className="stat-value">{stats?.activeStudents || 0}</p>
                            <p className="stat-detail">Currently enrolled</p>
                        </div>
                    </div>

                    <div className="stat-card" onClick={navigateToAttendance}>
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                            <FaCalendarCheck />
                        </div>
                        <div className="stat-info">
                            <h3>Attendance Tracking</h3>
                            <p className="stat-value">Active</p>
                            <p className="stat-detail">Real-time monitoring</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                            <FaExclamationTriangle />
                        </div>
                        <div className="stat-info">
                            <h3>Low Attendance</h3>
                            <p className="stat-value">{lowAttendance?.length || 0}</p>
                            <p className="stat-detail">Students below 75%</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="charts-grid">
                    {/* Department Distribution */}
                    <div className="chart-card">
                        <h3>Students by Department</h3>
                        {stats?.departmentStats && stats.departmentStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats.departmentStats}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ _id, count }) => `${_id}: ${count}`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {stats.departmentStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="no-data">No department data available</p>
                        )}
                    </div>

                    {/* Year Distribution */}
                    <div className="chart-card">
                        <h3>Students by Year</h3>
                        {stats?.yearStats && stats.yearStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.yearStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="_id" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                                    <YAxis label={{ value: 'Students', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#667eea" name="Number of Students" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="no-data">No year data available</p>
                        )}
                    </div>
                </div>

                {/* Low Attendance Alert */}
                {lowAttendance && lowAttendance.length > 0 && (
                    <div className="alert-card">
                        <div className="alert-header">
                            <FaExclamationTriangle />
                            <h3>Students with Low Attendance (Below 75%)</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="alert-table">
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Year</th>
                                        <th>Attendance %</th>
                                        <th>Classes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowAttendance.slice(0, 10).map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.student.studentId}</td>
                                            <td>{item.student.name}</td>
                                            <td>{item.student.department}</td>
                                            <td>Year {item.student.year}</td>
                                            <td>
                                                <span className="percentage low">
                                                    {item.attendance.percentage}%
                                                </span>
                                            </td>
                                            <td>{item.attendance.presentClasses}/{item.attendance.totalClasses}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="actions-grid">
                    <button className="action-btn primary" onClick={navigateToStudents}>
                        <FaUserGraduate />
                        <span>Manage Students</span>
                    </button>
                    <button className="action-btn secondary" onClick={navigateToAttendance}>
                        <FaCalendarCheck />
                        <span>View Attendance</span>
                    </button>
                    <button className="action-btn tertiary" onClick={() => navigate('/admin/reports')}>
                        <FaChartLine />
                        <span>Generate Reports</span>
                    </button>
                </div>
            </div>

            <footer className="dashboard-footer">
                <p>Developed by Swastik Bhardwaj (Person A) - Smart Campus Management System</p>
            </footer>
        </div>
    );
};

export default AdminDashboard;
