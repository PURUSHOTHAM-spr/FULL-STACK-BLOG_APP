// API Base URL Configuration
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultBaseUrl = import.meta.env.PROD
  ? "https://full-stack-blog-app-2.onrender.com"
  : "http://localhost:4000";
const BASE_URL = (
  configuredBaseUrl || defaultBaseUrl
).replace(/\/+$/, "");

export { BASE_URL };