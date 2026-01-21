const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const studentController = require('./controller');
const { protect, authorize } = require('../auth/middleware');

// Configure multer for CSV upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `students-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (path.extname(file.originalname) !== '.csv') {
            return cb(new Error('Only CSV files are allowed'));
        }
        cb(null, true);
    }
});

// Public routes (none for students)

// Protected routes - Admin and Faculty can view
router.get('/', protect, authorize('admin', 'faculty'), studentController.getAllStudents);
router.get('/stats', protect, authorize('admin', 'faculty'), studentController.getStudentStats);
router.get('/studentId/:studentId', protect, studentController.getStudentByStudentId);
router.get('/:id', protect, studentController.getStudentById);

// Protected routes - Admin only for modifications
router.post('/', protect, authorize('admin'), studentController.createStudent);
router.put('/:id', protect, authorize('admin'), studentController.updateStudent);
router.delete('/:id', protect, authorize('admin'), studentController.deleteStudent);

// CSV upload - Admin only
router.post('/upload-csv', protect, authorize('admin'), upload.single('file'), studentController.uploadStudentsCSV);

module.exports = router;
