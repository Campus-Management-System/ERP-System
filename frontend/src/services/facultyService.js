import api from "./api";

const getProfile = () => {
  return api.get("/faculty/profile");
};

const facultyService = {
  getProfile,
};

export default facultyService;
