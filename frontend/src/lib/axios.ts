import axios from "axios";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(
    /\/message$/,
    ""
  ) || "http://localhost:3000/chat";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Add OpenAI API key from localStorage to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem("openai_api_key");
    if (apiKey) {
      config.headers["x-openai-key"] = apiKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
