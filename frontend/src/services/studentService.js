import api from './api';

/**
 * Student Service
 */
const studentService = {
    // Get all students
    getAllStudents: async (params = {}) => {
        const response = await api.get('/students', { params });
        return response.data;
    },

    // Get student by ID
    getStudentById: async (id) => {
        const response = await api.get(`/students/${id}`);
        return response.data;
    },

    // Get student by student ID
    getStudentByStudentId: async (studentId) => {
        const response = await api.get(`/students/studentId/${studentId}`);
        return response.data;
    },

    // Create student
    createStudent: async (studentData) => {
        const response = await api.post('/students', studentData);
        return response.data;
    },

    // Update student
    updateStudent: async (id, studentData) => {
        const response = await api.put(`/students/${id}`, studentData);
        return response.data;
    },

    // Delete student
    deleteStudent: async (id) => {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    },

    // Upload students CSV
    uploadCSV: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/students/upload-csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Get student statistics
    getStats: async () => {
        const response = await api.get('/students/stats');
        return response.data;
    }
};

export default studentService;
