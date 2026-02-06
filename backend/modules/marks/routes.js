const express = require("express");
const { protect, authorize } = require("../auth/middleware");
const { addMarks, getMyMarks, getMarksBySubject } = require("./controller");

const router = express.Router();

// Faculty: Add Marks
router.post("/add", protect, authorize("faculty"), addMarks);

// Faculty: Get class performance
router.get(
  "/subject/:subjectCode",
  protect,
  authorize("faculty"),
  getMarksBySubject
);

// Student: View own marks
router.get("/my-marks", protect, authorize("student"), getMyMarks);

module.exports = router;
