import axios from 'axios';
import keycloak from '../Keycloak';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
});

export default api;