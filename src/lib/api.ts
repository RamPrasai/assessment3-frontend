// src/lib/api.ts
import axios from "axios";

// Use the value exactly as provided in Vercel (no hard-coded "/api")
const baseURL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, ""); // strip trailing "/"

console.log("API baseURL =", baseURL);

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
