import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';
import authService from './services/authService';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const isAuthenticated = authService.isAuthenticated();
    const userRole = authService.getUserRole();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="App">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />

                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes - Student */}
                    <Route
                        path="/student/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Routes - Faculty */}
                    <Route
                        path="/faculty/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['faculty']}>
                                <div className="coming-soon">
                                    <h1>Faculty Dashboard</h1>
                                    <p>Coming Soon - Person B Module</p>
                                </div>
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Routes - Admin */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    />

                    {/* Unauthorized */}
                    <Route
                        path="/unauthorized"
                        element={
                            <div className="error-page">
                                <h1>403 - Unauthorized</h1>
                                <p>You don't have permission to access this page.</p>
                                <button onClick={() => authService.logout()}>Back to Login</button>
                            </div>
                        }
                    />

                    {/* Default Route */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* 404 Not Found */}
                    <Route
                        path="*"
                        element={
                            <div className="error-page">
                                <h1>404 - Page Not Found</h1>
                                <p>The page you're looking for doesn't exist.</p>
                                <button onClick={() => window.location.href = '/login'}>Back to Login</button>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
