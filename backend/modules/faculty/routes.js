const express = require("express");
const { protect, authorize } = require("../auth/middleware");
const { getFacultyProfile, assignSubject } = require("./controller");

const router = express.Router();

// Faculty Dashboard Route (Only accessible by Faculty)
router.get("/profile", protect, authorize("faculty"), getFacultyProfile);

// Admin Action: Assign Subject (Only accessible by Admin)
router.post("/assign-subject", protect, authorize("admin"), assignSubject);

module.exports = router;
