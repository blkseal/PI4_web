import axios from 'axios';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Criar instância do axios configurada para a API
const api = axios.create({
  baseURL: '/v1',
  headers: {
    'Content-Type': 'application/json',
  },
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

    refreshPromise = axios
      .post('/v1/auth/refresh', { refreshToken })
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
