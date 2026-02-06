const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    facultyId: {
      type: String,
      required: [true, "Faculty ID is required"],
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      qualification: { type: String, required: true },
      experience: { type: Number, default: 0 }, // in years
      joiningDate: { type: Date, default: Date.now },
    },
    academicInfo: {
      department: { type: String, required: true },
      designation: { type: String, required: true }, // e.g., Assistant Professor
      specialization: [String],
    },
    subjectsAssigned: [
      {
        subjectName: String,
        subjectCode: String,
        semester: Number,
        branch: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Faculty", facultySchema);
