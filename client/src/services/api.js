import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
};

export const transactionAPI = {
  getAll: (params) => API.get("/transactions", { params }),
  create: (data) => API.post("/transactions", data),
  update: (id, data) => API.put("/transactions/" + id, data),
  delete: (id) => API.delete("/transactions/" + id),
  getStats: (params) => API.get("/transactions/stats", { params }),
};

export const budgetAPI = {
  getAll: () => API.get("/budgets"),
  getStatus: () => API.get("/budgets/status"),
  create: (data) => API.post("/budgets", data),
  update: (id, data) => API.put("/budgets/" + id, data),
  delete: (id) => API.delete("/budgets/" + id),
};

export const userAPI = {
  getProfile: () => API.get("/user/profile"),
  updateProfile: (data) => API.put("/user/profile", data),
  uploadPhoto: (formData) => API.post("/user/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
};

export default API;
