import axios from "axios";
import { tokenRefreshEndpoint } from "./apiEndpoints";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/api/"
      : "http://espider.herokuapp.com",
  timeout: 5000,
  headers: {
    Authorization: "JWT " + localStorage.getItem("token"),
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// use refresh token if 401 error
// source of this code:
//   https://hackernoon.com/110percent-complete-jwt-authentication-with-django-and-react-2020-iejq34ta

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized" &&
      localStorage.hasOwnProperty("refresh")
    ) {
      const refreshToken = localStorage.getItem("refresh");

      return axiosInstance
        .post(tokenRefreshEndpoint, { refresh: refreshToken })
        .then(response => {
          localStorage.setItem("token", response.data.access);
          localStorage.setItem("refresh", response.data.refresh);

          axiosInstance.defaults.headers["Authorization"] = "JWT " + response.data.access;
          originalRequest.headers["Authorization"] = "JWT " + response.data.access;

          return axiosInstance(originalRequest);
        })
        .catch(err => {
          console.log(err);
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
