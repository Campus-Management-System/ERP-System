const express = require('express');
const router = express.Router();
const attendanceController = require('./controller');
const { protect, authorize } = require('../auth/middleware');

// All routes are protected

// Mark attendance - Faculty and Admin
router.post('/mark', protect, authorize('faculty', 'admin'), attendanceController.markAttendance);

// Update attendance - Faculty and Admin
router.put('/:id', protect, authorize('faculty', 'admin'), attendanceController.updateAttendance);

// Delete attendance - Admin only
router.delete('/:id', protect, authorize('admin'), attendanceController.deleteAttendance);

// Get attendance by student - All authenticated users
router.get('/student/:studentId', protect, attendanceController.getAttendanceByStudent);

// Get attendance statistics - All authenticated users
router.get('/stats/:studentId', protect, attendanceController.getAttendanceStats);

// Get attendance by subject - Faculty and Admin
router.get('/subject/:subjectCode', protect, authorize('faculty', 'admin'), attendanceController.getAttendanceBySubject);

// Get attendance by date - Faculty and Admin
router.get('/date/:date', protect, authorize('faculty', 'admin'), attendanceController.getAttendanceByDate);

// Get low attendance students - Faculty and Admin
router.get('/low-attendance', protect, authorize('faculty', 'admin'), attendanceController.getLowAttendanceStudents);

module.exports = router;
