const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Import routes - Person A Modules
const authRoutes = require("./modules/auth/routes");
const studentRoutes = require("./modules/students/routes");
const attendanceRoutes = require("./modules/attendance/routes");

//Import routes - Person B Modules
const facultyRoutes = require("./modules/faculty/routes");
const marksRoutes = require("./modules/marks/routes");

// API Routes - Person A
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

// API Routes - Person B
app.use("/api/faculty", facultyRoutes);
app.use("/api/marks", marksRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Campus Management System API",
    developer: "Swastik Bhardwaj (Person A)",
    modules: [
      "Authentication & Authorization",
      "Student Management",
      "Attendance Management",
      "Student Dashboard",
    ],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`👨‍💻 Developer: Swastik Bhardwaj (Person A)`);
});

module.exports = app;
