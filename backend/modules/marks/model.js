const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      name: { type: String, required: true },
      code: { type: String, required: true },
    },
    examType: {
      type: String,
      enum: ["Mid-Semester", "End-Semester", "Internal", "Practical"],
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    semester: {
      type: Number,
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The faculty member who graded this
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student gets only one grade per subject per exam type
marksSchema.index(
  { student: 1, "subject.code": 1, examType: 1 },
  { unique: true }
);

module.exports = mongoose.model("Marks", marksSchema);
