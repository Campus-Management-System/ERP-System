const Marks = require("./model");
const Student = require("../students/model");

// @desc    Add or Update Marks
// @route   POST /api/marks/add
// @access  Private (Faculty only)
exports.addMarks = async (req, res) => {
  try {
    const {
      studentId,
      subjectName,
      subjectCode,
      examType,
      marksObtained,
      semester,
    } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    let marksRecord = await Marks.findOne({
      student: student._id,
      "subject.code": subjectCode,
      examType,
    });

    if (marksRecord) {
      marksRecord.marksObtained = marksObtained;
      marksRecord.faculty = req.user.id;
      await marksRecord.save();
    } else {
      marksRecord = await Marks.create({
        student: student._id,
        subject: { name: subjectName, code: subjectCode },
        examType,
        marksObtained,
        semester,
        faculty: req.user.id,
      });
    }

    res.status(200).json({
      success: true,
      message: "Marks saved successfully",
      data: marksRecord,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Marks for the Logged-in Student
// @route   GET /api/marks/my-marks
// @access  Private (Student)
exports.getMyMarks = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student profile not found" });
    }

    const marks = await Marks.find({ student: student._id });

    res.status(200).json({
      success: true,
      data: marks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Marks by Subject
// @route   GET /api/marks/subject/:subjectCode
// @access  Private (Faculty)
exports.getMarksBySubject = async (req, res) => {
  try {
    const marks = await Marks.find({
      "subject.code": req.params.subjectCode,
    }).populate(
      "student",
      "studentId personalInfo.firstName personalInfo.lastName"
    );

    res.status(200).json({
      success: true,
      data: marks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
