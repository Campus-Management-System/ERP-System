import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import studentService from '../services/studentService';
import attendanceService from '../services/attendanceService';
import {
    FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck, FaChartLine,
    FaFileUpload, FaDownload, FaSearch, FaFilter, FaPlus, FaEdit,
    FaTrash, FaBell, FaCog, FaSignOutAlt, FaHome, FaUsers, FaBook,
    FaClipboardList, FaExclamationTriangle, FaCheckCircle, FaTimes,
    FaEnvelope, FaPrint, FaFileExcel, FaFilePdf, FaUserShield
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState(null);
    const [lowAttendance, setLowAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);

            // Fetch all data
            const [statsRes, studentsRes, lowAttRes] = await Promise.all([
                studentService.getStats(),
                studentService.getAllStudents({ limit: 100 }),
                attendanceService.getLowAttendanceStudents({ threshold: 75 })
            ]);

            setStats(statsRes.data);
            setStudents(studentsRes.data);
            setLowAttendance(lowAttRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await studentService.deleteStudent(id);
                toast.success('Student deleted successfully');
                fetchAllData();
            } catch (error) {
                toast.error('Failed to delete student');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedStudents.length === 0) {
            toast.warning('Please select students to delete');
            return;
        }

        if (window.confirm(`Delete ${selectedStudents.length} students?`)) {
            try {
                await Promise.all(selectedStudents.map(id => studentService.deleteStudent(id)));
                toast.success(`${selectedStudents.length} students deleted`);
                setSelectedStudents([]);
                fetchAllData();
            } catch (error) {
                toast.error('Failed to delete students');
            }
        }
    };

    const handleExportCSV = () => {
        const csv = [
            ['Student ID', 'Name', 'Email', 'Department', 'Year', 'Status'],
            ...students.map(s => [
                s.studentId,
                `${s.personalInfo.firstName} ${s.personalInfo.lastName}`,
                s.personalInfo.email,
                s.academicInfo.department,
                s.academicInfo.currentYear,
                s.status
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students.csv';
        a.click();
        toast.success('CSV exported successfully');
    };

    const handleSendBulkEmail = () => {
        if (selectedStudents.length === 0) {
            toast.warning('Please select students');
            return;
        }
        toast.info(`Email functionality coming soon for ${selectedStudents.length} students`);
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = !filterDepartment || student.academicInfo.department === filterDepartment;
        const matchesYear = !filterYear || student.academicInfo.currentYear === parseInt(filterYear);

        return matchesSearch && matchesDept && matchesYear;
    });

    const departments = [...new Set(students.map(s => s.academicInfo.department))];

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner-large"></div>
                <p>Loading Admin Panel...</p>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <FaUserShield className="logo-icon" />
                    <h2>Admin Panel</h2>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <FaHome /> Dashboard
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        <FaUserGraduate /> Students
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'faculty' ? 'active' : ''}`}
                        onClick={() => setActiveTab('faculty')}
                    >
                        <FaChalkboardTeacher /> Faculty
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        <FaCalendarCheck /> Attendance
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        <FaChartLine /> Reports
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <FaCog /> Settings
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">{user?.name?.charAt(0)}</div>
                        <div className="user-details">
                            <p className="user-name">{user?.name}</p>
                            <p className="user-role">Administrator</p>
                        </div>
                    </div>
                    <button className="logout-btn-sidebar" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Bar */}
                <header className="admin-topbar">
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    <div className="topbar-actions">
                        <button className="icon-btn" title="Notifications">
                            <FaBell />
                            <span className="badge">3</span>
                        </button>
                        <button className="icon-btn" title="Settings">
                            <FaCog />
                        </button>
                    </div>
                </header>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="tab-content">
                        {/* Quick Stats */}
                        <div className="stats-grid-admin">
                            <div className="stat-card-admin purple">
                                <div className="stat-icon">
                                    <FaUserGraduate />
                                </div>
                                <div className="stat-details">
                                    <h3>Total Students</h3>
                                    <p className="stat-number">{stats?.totalStudents || 0}</p>
                                    <span className="stat-change positive">+12% from last month</span>
                                </div>
                            </div>

                            <div className="stat-card-admin blue">
                                <div className="stat-icon">
                                    <FaCheckCircle />
                                </div>
                                <div className="stat-details">
                                    <h3>Active Students</h3>
                                    <p className="stat-number">{stats?.activeStudents || 0}</p>
                                    <span className="stat-change positive">100% active</span>
                                </div>
                            </div>

                            <div className="stat-card-admin green">
                                <div className="stat-icon">
                                    <FaChalkboardTeacher />
                                </div>
                                <div className="stat-details">
                                    <h3>Faculty Members</h3>
                                    <p className="stat-number">2</p>
                                    <span className="stat-change">Active</span>
                                </div>
                            </div>

                            <div className="stat-card-admin orange">
                                <div className="stat-icon">
                                    <FaExclamationTriangle />
                                </div>
                                <div className="stat-details">
                                    <h3>Low Attendance</h3>
                                    <p className="stat-number">{lowAttendance?.length || 0}</p>
                                    <span className="stat-change negative">Needs attention</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="actions-grid">
                                <button className="action-card" onClick={() => setActiveTab('students')}>
                                    <FaPlus />
                                    <span>Add Student</span>
                                </button>
                                <button className="action-card" onClick={() => setActiveTab('faculty')}>
                                    <FaChalkboardTeacher />
                                    <span>Manage Faculty</span>
                                </button>
                                <button className="action-card" onClick={() => setActiveTab('attendance')}>
                                    <FaCalendarCheck />
                                    <span>Mark Attendance</span>
                                </button>
                                <button className="action-card" onClick={handleExportCSV}>
                                    <FaDownload />
                                    <span>Export Data</span>
                                </button>
                                <button className="action-card" onClick={() => setActiveTab('reports')}>
                                    <FaChartLine />
                                    <span>View Reports</span>
                                </button>
                                <button className="action-card">
                                    <FaFileUpload />
                                    <span>Bulk Upload</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="recent-activity">
                            <h2>Recent Activity</h2>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <div className="activity-icon green">
                                        <FaCheckCircle />
                                    </div>
                                    <div className="activity-details">
                                        <p className="activity-title">New student registered</p>
                                        <p className="activity-time">2 minutes ago</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon blue">
                                        <FaCalendarCheck />
                                    </div>
                                    <div className="activity-details">
                                        <p className="activity-title">Attendance marked for CS301</p>
                                        <p className="activity-time">15 minutes ago</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon orange">
                                        <FaExclamationTriangle />
                                    </div>
                                    <div className="activity-details">
                                        <p className="activity-title">Low attendance alert</p>
                                        <p className="activity-time">1 hour ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div className="tab-content">
                        {/* Toolbar */}
                        <div className="content-toolbar">
                            <div className="toolbar-left">
                                <div className="search-box">
                                    <FaSearch />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                                <select
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Years</option>
                                    <option value="1">Year 1</option>
                                    <option value="2">Year 2</option>
                                    <option value="3">Year 3</option>
                                    <option value="4">Year 4</option>
                                </select>
                            </div>
                            <div className="toolbar-right">
                                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                                    <FaPlus /> Add Student
                                </button>
                                <button className="btn-secondary" onClick={handleExportCSV}>
                                    <FaFileExcel /> Export CSV
                                </button>
                                <button className="btn-secondary">
                                    <FaFilePdf /> Export PDF
                                </button>
                                {selectedStudents.length > 0 && (
                                    <>
                                        <button className="btn-danger" onClick={handleBulkDelete}>
                                            <FaTrash /> Delete ({selectedStudents.length})
                                        </button>
                                        <button className="btn-secondary" onClick={handleSendBulkEmail}>
                                            <FaEnvelope /> Email ({selectedStudents.length})
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Students Table */}
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedStudents(filteredStudents.map(s => s._id));
                                                    } else {
                                                        setSelectedStudents([]);
                                                    }
                                                }}
                                                checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                                            />
                                        </th>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Year</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map(student => (
                                        <tr key={student._id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedStudents([...selectedStudents, student._id]);
                                                        } else {
                                                            setSelectedStudents(selectedStudents.filter(id => id !== student._id));
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td><strong>{student.studentId}</strong></td>
                                            <td>{`${student.personalInfo.firstName} ${student.personalInfo.lastName}`}</td>
                                            <td>{student.personalInfo.email}</td>
                                            <td>{student.academicInfo.department}</td>
                                            <td>Year {student.academicInfo.currentYear}</td>
                                            <td>
                                                <span className={`status-badge ${student.status.toLowerCase()}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-icon edit"
                                                        title="Edit"
                                                        onClick={() => {
                                                            setEditingStudent(student);
                                                            setShowEditModal(true);
                                                        }}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="btn-icon delete"
                                                        title="Delete"
                                                        onClick={() => handleDeleteStudent(student._id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                    <button className="btn-icon view" title="View Details">
                                                        <FaSearch />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-footer">
                            <p>Showing {filteredStudents.length} of {students.length} students</p>
                        </div>
                    </div>
                )}

                {/* Faculty Tab */}
                {activeTab === 'faculty' && (
                    <div className="tab-content">
                        <div className="coming-soon-section">
                            <FaChalkboardTeacher className="coming-soon-icon" />
                            <h2>Faculty Management</h2>
                            <p>This module is under development (Person B's work)</p>
                            <div className="feature-list">
                                <div className="feature-item"><FaCheckCircle /> Add/Edit Faculty</div>
                                <div className="feature-item"><FaCheckCircle /> Assign Subjects</div>
                                <div className="feature-item"><FaCheckCircle /> View Performance</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                    <div className="tab-content">
                        <div className="coming-soon-section">
                            <FaCalendarCheck className="coming-soon-icon" />
                            <h2>Attendance Management</h2>
                            <p>Advanced attendance features coming soon</p>
                            <div className="feature-list">
                                <div className="feature-item"><FaCheckCircle /> Mark Attendance</div>
                                <div className="feature-item"><FaCheckCircle /> View Reports</div>
                                <div className="feature-item"><FaCheckCircle /> Generate Alerts</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                    <div className="tab-content">
                        <div className="reports-grid">
                            <div className="report-card">
                                <FaChartLine className="report-icon" />
                                <h3>Attendance Report</h3>
                                <p>Generate detailed attendance reports</p>
                                <button className="btn-primary">Generate</button>
                            </div>
                            <div className="report-card">
                                <FaFileExcel className="report-icon" />
                                <h3>Student List</h3>
                                <p>Export complete student database</p>
                                <button className="btn-primary" onClick={handleExportCSV}>Export</button>
                            </div>
                            <div className="report-card">
                                <FaFilePdf className="report-icon" />
                                <h3>Performance Report</h3>
                                <p>Academic performance analysis</p>
                                <button className="btn-primary">Generate</button>
                            </div>
                            <div className="report-card">
                                <FaPrint className="report-icon" />
                                <h3>Custom Report</h3>
                                <p>Create custom reports</p>
                                <button className="btn-primary">Create</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="tab-content">
                        <div className="settings-section">
                            <h2>System Settings</h2>
                            <div className="settings-grid">
                                <div className="setting-item">
                                    <h3>Academic Year</h3>
                                    <select className="setting-input">
                                        <option>2023-2024</option>
                                        <option>2024-2025</option>
                                    </select>
                                </div>
                                <div className="setting-item">
                                    <h3>Attendance Threshold</h3>
                                    <input type="number" className="setting-input" defaultValue="75" />
                                </div>
                                <div className="setting-item">
                                    <h3>Email Notifications</h3>
                                    <label className="toggle">
                                        <input type="checkbox" defaultChecked />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="setting-item">
                                    <h3>SMS Alerts</h3>
                                    <label className="toggle">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            <button className="btn-primary mt-20">Save Settings</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
