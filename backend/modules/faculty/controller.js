const Faculty = require("./model");
const User = require("../auth/model");

// @desc    Get Current Faculty Profile
// @route   GET /api/faculty/profile
// @access  Private (Faculty)
exports.getFacultyProfile = async (req, res) => {
  try {
    // Find faculty linked to the logged-in user's ID
    const faculty = await Faculty.findOne({ userId: req.user.id }).populate(
      "userId",
      "email role"
    );

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign Subject to Faculty
// @route   POST /api/faculty/assign-subject
// @access  Private (Admin)
exports.assignSubject = async (req, res) => {
  try {
    const { facultyId, subjectName, subjectCode, semester, branch } = req.body;

    const faculty = await Faculty.findOne({ facultyId });
    if (!faculty) {
      return res
        .status(404)
        .json({ success: false, message: "Faculty not found" });
    }

    // Add new subject to the array
    faculty.subjectsAssigned.push({
      subjectName,
      subjectCode,
      semester,
      branch,
    });
    await faculty.save();

    res.status(200).json({
      success: true,
      message: "Subject assigned successfully",
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
