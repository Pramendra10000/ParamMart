import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================
// Automatically attach JWT token to every request.
// =========================================================

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("parammart_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

axiosClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Unauthorized
      if (status === 401) {
        localStorage.removeItem("parammart_token");
      }

      return Promise.reject(error);
    }

    // Network / server unavailable
    return Promise.reject(error);
  }
);

export default axiosClient;