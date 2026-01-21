import api from './api';

/**
 * Attendance Service
 */
const attendanceService = {
    // Mark attendance
    markAttendance: async (attendanceRecords) => {
        const response = await api.post('/attendance/mark', { attendanceRecords });
        return response.data;
    },

    // Update attendance
    updateAttendance: async (id, data) => {
        const response = await api.put(`/attendance/${id}`, data);
        return response.data;
    },

    // Delete attendance
    deleteAttendance: async (id) => {
        const response = await api.delete(`/attendance/${id}`);
        return response.data;
    },

    // Get attendance by student
    getAttendanceByStudent: async (studentId, params = {}) => {
        const response = await api.get(`/attendance/student/${studentId}`, { params });
        return response.data;
    },

    // Get attendance statistics
    getAttendanceStats: async (studentId) => {
        const response = await api.get(`/attendance/stats/${studentId}`);
        return response.data;
    },

    // Get attendance by subject
    getAttendanceBySubject: async (subjectCode, params = {}) => {
        const response = await api.get(`/attendance/subject/${subjectCode}`, { params });
        return response.data;
    },

    // Get attendance by date
    getAttendanceByDate: async (date, params = {}) => {
        const response = await api.get(`/attendance/date/${date}`, { params });
        return response.data;
    },

    // Get low attendance students
    getLowAttendanceStudents: async (params = {}) => {
        const response = await api.get('/attendance/low-attendance', { params });
        return response.data;
    }
};

export default attendanceService;
