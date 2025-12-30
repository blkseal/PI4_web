import axios from "axios";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// Criar instância do axios configurada para a API
// Allow overriding the API base URL at build time via Vite env var `VITE_API_URL`.
// In development we keep the local proxy (`/v1`) from vite.config.js so don't set the env var.
const defaultBase = "/v1";
const envBase =
  typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : null;

const api = axios.create({
  baseURL: envBase || defaultBase,
  headers: {
    "Content-Type": "application/json",
  },
  // Allow sending cookies/credentials to the backend (for cookie-based sessions)
  withCredentials: true,
});

// Helper para obter tokens armazenados
const getStoredTokens = () => ({
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
});

// Helper para guardar tokens
const storeTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Helper para limpar tokens
const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Request interceptor: anexa Authorization se houver token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getStoredTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // If sending FormData, let the browser set the multipart Content-Type
    // including the boundary. The instance default header forces
    // application/json which breaks multipart uploads.
    try {
      if (typeof FormData !== "undefined" && config.data instanceof FormData) {
        if (config.headers) {
          delete config.headers["Content-Type"];
          delete config.headers["content-type"];
        }
      }
    } catch (e) {
      console.log(e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise = null;

// Tenta renovar token usando refresh token
const refreshAccessToken = async () => {
  if (!refreshPromise) {
    const { refreshToken } = getStoredTokens();
    if (!refreshToken) return null;

    const baseURL = api.defaults.baseURL;
    // Remove trailing slash if present to avoid double slash with /auth
    const cleanBase = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    // If cleanBase ends with /v1, we append /auth/refresh. 
    // Wait, the hardcoded was /v1/auth/refresh.
    // If baseURL IS /v1 (default), then cleanBase is /v1. url -> /v1/auth/refresh. Correct.
    // If baseURL is https://.../v1, url -> https://.../v1/auth/refresh. Correct.

    refreshPromise = axios
      .post(`${cleanBase}/auth/refresh`, { refreshToken })
      .then((resp) => {
        const newAccessToken = resp?.data?.accessToken;
        if (newAccessToken) {
          storeTokens({ accessToken: newAccessToken });
          return newAccessToken;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Response interceptor: tenta refresh em 401 uma vez
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
      clearTokens();
    }

    return Promise.reject(error);
  }
);

export { storeTokens, clearTokens, getStoredTokens };
export default api;
