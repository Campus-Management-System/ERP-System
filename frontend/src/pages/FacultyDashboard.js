import React, { useState, useEffect } from 'react';
import facultyService from '../services/facultyService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { 
    FaChalkboardTeacher, 
    FaChartPie, 
    FaBook, 
    FaClipboardList, 
    FaClock, 
    FaSignOutAlt, 
    FaBell, 
    FaCog,
    FaUserGraduate,
    FaCheckCircle
} from 'react-icons/fa';
import '../styles/FacultyDashboard.css';
import MarksEntry from "../components/MarksEntry";

const FacultyDashboard = () => {
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await facultyService.getProfile();
                setFaculty(response.data.data);
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!faculty) return <div className="loading-container">No profile found.</div>;

    return (
      <div className="faculty-panel">
        {/* 1. SIDEBAR */}
        <aside className="faculty-sidebar">
          <div className="sidebar-header">
            <FaChalkboardTeacher className="logo-icon" />
            <h2>Faculty Portal</h2>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaChartPie /> Dashboard
            </button>
            <button
              className={`nav-item ${activeTab === "subjects" ? "active" : ""}`}
              onClick={() => setActiveTab("subjects")}
            >
              <FaBook /> My Subjects
            </button>
            <button
              className={`nav-item ${activeTab === "marks" ? "active" : ""}`}
              onClick={() => setActiveTab("marks")}
            >
              <FaClipboardList /> Student Marks
            </button>
            <button
              className={`nav-item ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              <FaClock /> Timetable
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {faculty.personalInfo.firstName.charAt(0)}
              </div>
              <div className="user-details">
                <p className="user-name">
                  {faculty.personalInfo.firstName}{" "}
                  {faculty.personalInfo.lastName}
                </p>
                <p className="user-role">{faculty.academicInfo.designation}</p>
              </div>
            </div>
            <button className="logout-btn-sidebar" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </aside>

        {/* 2. MAIN CONTENT */}
        <main className="faculty-main">
          {/* Top Bar */}
          <header className="faculty-topbar">
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

          {/* Content Area */}
          <div className="dashboard-content">
            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <>
                {/* Stats Grid */}
                <div className="stats-grid">
                  <div className="stat-card blue">
                    <div className="stat-icon">
                      <FaCheckCircle />
                    </div>
                    <div className="stat-details">
                      <h3>Experience</h3>
                      <p className="stat-number">
                        {faculty.personalInfo.experience} Years
                      </p>
                    </div>
                  </div>

                  <div className="stat-card purple">
                    <div className="stat-icon">
                      <FaBook />
                    </div>
                    <div className="stat-details">
                      <h3>Subjects</h3>
                      <p className="stat-number">
                        {faculty.subjectsAssigned
                          ? faculty.subjectsAssigned.length
                          : 0}
                      </p>
                    </div>
                  </div>

                  <div className="stat-card green">
                    <div className="stat-icon">
                      <FaUserGraduate />
                    </div>
                    <div className="stat-details">
                      <h3>Students</h3>
                      <p className="stat-number">--</p>
                      {/* Placeholder until Module 6 */}
                    </div>
                  </div>
                </div>

                {/* Subjects Overview */}
                <h2 className="section-title">My Assigned Subjects</h2>
                <div className="stats-grid">
                  {faculty.subjectsAssigned &&
                    faculty.subjectsAssigned.map((sub, index) => (
                      <div key={index} className="subject-card">
                        <div className="subject-header">
                          <h4>{sub.subjectName}</h4>
                          <span className="subject-code">
                            {sub.subjectCode}
                          </span>
                        </div>
                        <div className="subject-details">
                          <span>
                            <FaUserGraduate /> {sub.branch}
                          </span>
                          <span>Semester: {sub.semester}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {/* SUBJECTS TAB (Placeholder logic for now) */}
            {activeTab === "subjects" && (
              <div>
                <h2 className="section-title">Detailed Subject List</h2>
                <div className="stats-grid">
                  {faculty.subjectsAssigned &&
                    faculty.subjectsAssigned.map((sub, index) => (
                      <div key={index} className="subject-card">
                        <div className="subject-header">
                          <h4>{sub.subjectName}</h4>
                          <span className="subject-code">
                            {sub.subjectCode}
                          </span>
                        </div>
                        <div className="subject-details">
                          <span>Branch: {sub.branch}</span>
                          <span>Semester: {sub.semester}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* MARKS TAB */}
            {activeTab === "marks" && (
              <div style={{ padding: "20px" }}>
                <h2 className="section-title">Marks Management</h2>

                {/* Pass the faculty's subjects to the form */}
                <MarksEntry subjects={faculty.subjectsAssigned} />
              </div>
            )}
          </div>
        </main>
      </div>
    );
};

export default FacultyDashboard;