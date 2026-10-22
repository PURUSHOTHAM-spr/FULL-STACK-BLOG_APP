// API Base URL Configuration
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = (
  configuredBaseUrl || "http://localhost:4000"
).replace(/\/+$/, "");

export { BASE_URL };