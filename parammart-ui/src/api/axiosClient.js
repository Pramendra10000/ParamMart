import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Attach JWT automatically to every request.
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("parammart_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
 * Centralized API error handling.
 */
axiosClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {

      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem("parammart_token");
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;