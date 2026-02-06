import api from "./api";

// Add marks for a student
const addMarks = (marksData) => {
  return api.post("/marks/add", marksData);
};

// Get marks for a specific subject (for faculty view)
const getMarksBySubject = (subjectCode) => {
  return api.get(`/marks/subject/${subjectCode}`);
};

// Get logged-in student's marks
const getMyMarks = () => {
  return api.get("/marks/my-marks");
};

const marksService = {
  addMarks,
  getMarksBySubject,
  getMyMarks,
};

export default marksService;
