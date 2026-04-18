// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/common-api/login`,
  LOGOUT: `${API_BASE_URL}/common-api/logout`,
  CHECK_AUTH: `${API_BASE_URL}/common-api/check-auth`,
  // Add other endpoints here
};
