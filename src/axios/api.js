import axios from "axios";

// Create a separate instance for token refresh to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout for refresh requests
});

// Main API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout for regular requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper: Check if JWT token is expired
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now(); // Convert expiry time (seconds) to milliseconds
  } catch (err) {
    console.error("Error parsing token:", err);
    return true; // If token is invalid, treat as expired
  }
};

// Flag to track if a refresh is in progress
let isRefreshing = false;
// Store for callbacks to be executed after token refresh
let refreshSubscribers = [];

// Function to refresh the token
const refreshToken = async () => {
  if (isRefreshing) {
    // If a refresh is already in progress, return a promise that resolves when it completes
    return new Promise((resolve, reject) => {
      refreshSubscribers.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const { data } = await refreshClient.get("/refresh", {
      withCredentials: true,
    });

    if (!data.accessToken) {
      throw new Error("No access token received from refresh endpoint");
    }

    localStorage.setItem("accessToken", data.accessToken);

    // Notify subscribers that the token has been refreshed
    refreshSubscribers.forEach((cb) => cb.resolve(data.accessToken));
    refreshSubscribers = [];

    isRefreshing = false;
    return data.accessToken;
  } catch (error) {
    // Notify subscribers that the refresh failed
    refreshSubscribers.forEach((cb) => cb.reject(error));
    refreshSubscribers = [];

    // Clear token on refresh failure
    localStorage.removeItem("accessToken");
    isRefreshing = false;

    // Log the error for debugging
    console.error("Token refresh failed:", error);
    throw error;
  }
};

// Request Interceptor: Check token before sending requests
api.interceptors.request.use(
  async (config) => {
    // Skip token check for refresh requests to avoid loops
    if (config.url === "/refresh") {
      return config;
    }

    let accessToken = localStorage.getItem("accessToken");

    // If token exists but is expired, refresh it
    if (accessToken && isTokenExpired(accessToken)) {
      try {
        accessToken = await refreshToken();
      } catch (error) {
        console.error("Token refresh failed in request interceptor:", error);
        // Don't throw here - let the request proceed and let the response interceptor handle it
      }
    }

    // Set authorization header if we have a token
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 errors (token expired mid-request)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const excludedPaths = ["/login", "/signup", "/forgot-password"];
    const currentPath = window.location.pathname;

    // Skip refresh logic for excluded paths
    const isExcluded = excludedPaths.some((path) =>
      currentPath.startsWith(path)
    );

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    }

    // Handle 401/403 errors
    if (
      error.response?.status === 403 ||
      (error.response?.status === 401 && !originalRequest._retry && !isExcluded)
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const newToken = await refreshToken();

        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Token refresh failed in response interceptor:",
          refreshError
        );

        // If we're already on the login page, don't redirect again to avoid loops
        if (window.location.pathname !== "/login") {
          // Clear any existing timeouts to prevent multiple redirects
          if (window.redirectTimeout) {
            clearTimeout(window.redirectTimeout);
          }

          // Use a timeout to avoid immediate redirect which can cause React rendering issues
          window.redirectTimeout = setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    console.error("API error:", errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
