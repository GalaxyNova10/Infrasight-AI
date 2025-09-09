import axios from 'axios';

// The Vite proxy will handle rewriting /api/v1 to the backend URL in development.
const api = axios.create({
  baseURL: '/api', // Changed to /api to use the Vite proxy
});

// Interceptor to add the JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// --- AUTHENTICATION ---
export const login = async (email, password) => {
  // FastAPI's login endpoint expects form data, not JSON.
  const formData = new URLSearchParams();
  formData.append('username', email); // The backend expects the email in the 'username' field.
  formData.append('password', password);

  const response = await api.post(`/auth/token`, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data; // This will return your access token.
};

export const register = async (userData) => {
  const response = await api.post(`/auth/register`, userData);
  return response.data;
};

// --- USER ---
export const getProfile = () => api.get('/users/me');
export const getUsers = () => api.get('/users/');


// --- ISSUES & REPORTS ---
export const getIssues = (status) => {
  const params = status ? { status } : {};
  return api.get(`/issues/`, { params });
};
export const createWorkOrder = (workOrderData) => api.post('/issues/work-orders', workOrderData);
export const resolveIssue = (issueId) => api.patch(`/issues/${issueId}/resolve`);

export const submitReport = async (reportData, imageFile) => {
  const data = { ...reportData }; // Start with report data
  if (imageFile) {
    // Convert image to base64
    const reader = new FileReader();
    const base64Image = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(imageFile);
    });
    data.image_base64 = base64Image;
    data.filename = imageFile.name;
  }
  const response = await api.post(`/citizen-reports/`, data); // Send as JSON
  return response.data;
};

// NEW: Function to get all reports for the admin dashboard
export const getAdminReports = () => {
  return api.get(`/reports/admin/reports`); // Calls the new backend endpoint
};

// --- COMMUNITY HUB ---
// A single, efficient function to get all data for the community page
export const getCommunityData = () => api.get('/community/');

// --- COMPUTER VISION ---
// Function to send an image for AI prediction (old synchronous endpoint)
export const predictImage = async (imageFile) => {
    const reader = new FileReader();
    const base64Image = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(imageFile);
    });
    
    const data = {
        image_base64: base64Image,
        filename: imageFile.name,
    };
    
    const response = await api.post('/cv-api/predict/image', data); // Send as JSON
    return response.data;
};

// New: Function to submit an image for asynchronous processing
export const submitImageForProcessing = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await api.post('/cv-api/predict-async', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // Should return { job_id: "..." }
};

// New: Function to get the status and results of an asynchronous processing job
export const getProcessingResults = async (jobId) => {
  const response = await api.get(`/cv-api/results/${jobId}`);
  return response.data; // Should return { status: "processing" } or { status: "complete", ... }
};