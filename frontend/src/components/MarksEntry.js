import React, { useState } from "react";
import marksService from "../services/marksService";
import { FaSave, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const MarksEntry = ({ subjects }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    subjectCode: "",
    examType: "Mid-Semester",
    marksObtained: "",
    semester: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto-fill subject name based on code selection
  const handleSubjectChange = (e) => {
    const selectedCode = e.target.value;
    const selectedSubject = subjects.find(
      (sub) => sub.subjectCode === selectedCode
    );

    setFormData({
      ...formData,
      subjectCode: selectedCode,
      subjectName: selectedSubject ? selectedSubject.subjectName : "",
      semester: selectedSubject ? selectedSubject.semester : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await marksService.addMarks(formData);
      setMessage({ type: "success", text: "Marks saved successfully!" });
      // Optional: Clear student ID and marks for next entry
      setFormData((prev) => ({ ...prev, studentId: "", marksObtained: "" }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error saving marks",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Enter Student Marks</h3>

      {message && (
        <div style={message.type === "success" ? styles.success : styles.error}>
          {message.type === "success" ? (
            <FaCheckCircle />
          ) : (
            <FaExclamationCircle />
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* 1. Select Subject */}
        <div style={styles.formGroup}>
          <label>Select Subject</label>
          <select
            name="subjectCode"
            value={formData.subjectCode}
            onChange={handleSubjectChange}
            required
            style={styles.input}
          >
            <option value="">-- Choose Subject --</option>
            {subjects.map((sub) => (
              <option key={sub.subjectCode} value={sub.subjectCode}>
                {sub.subjectName} ({sub.subjectCode})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Select Exam Type */}
        <div style={styles.formGroup}>
          <label>Exam Type</label>
          <select
            name="examType"
            value={formData.examType}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Mid-Semester">Mid-Semester</option>
            <option value="End-Semester">End-Semester</option>
            <option value="Internal">Internal Assessment</option>
            <option value="Practical">Practical</option>
          </select>
        </div>

        {/* 3. Student ID */}
        <div style={styles.formGroup}>
          <label>Student ID (e.g., STU001)</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Enter Student ID"
            required
            style={styles.input}
          />
        </div>

        {/* 4. Marks */}
        <div style={styles.formGroup}>
          <label>Marks Obtained (0-100)</label>
          <input
            type="number"
            name="marksObtained"
            value={formData.marksObtained}
            onChange={handleChange}
            min="0"
            max="100"
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? (
            "Saving..."
          ) : (
            <>
              <FaSave /> Save Marks
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Simple inline styles to match your clean theme
const styles = {
  container: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#1e293b",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  success: {
    padding: "10px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  error: {
    padding: "10px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

export default MarksEntry;
