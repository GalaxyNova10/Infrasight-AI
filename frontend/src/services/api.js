import axios from 'axios';

// The Vite proxy will handle rewriting /api/v1 to the backend URL in development.
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // CORRECTED: This now matches the backend prefix.
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

export const loginWithGoogle = async (token) => {
  const response = await api.post(`/auth/google`, { token });
  return response.data;
};

// --- USER ---
export const getProfile = () => api.get('/users/me');


// --- ISSUES & REPORTS ---
export const getIssues = () => api.get(`/issues`);

export const submitReport = async (reportData, imageFile) => {
  const formData = new FormData();
  for (const key in reportData) {
    formData.append(key, reportData[key]);
  }
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const response = await api.post(`/citizen-reports/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// --- COMMUNITY HUB ---
// A single, efficient function to get all data for the community page
export const getCommunityData = () => api.get('/community/');

// --- COMPUTER VISION ---
// Function to send an image for AI prediction
export const predictImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    
    const response = await api.post('/cv-api/predict/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
