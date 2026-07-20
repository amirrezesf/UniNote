import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { tokenStore } from './tokenStore';

// @ts-ignore
const baseURL = (import.meta as any).env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api';

export const api = axios.create({ baseURL });

// Attach token
api.interceptors.request.use((config) => {
  const access = tokenStore.access;
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccess(): Promise<string | null> {
  const refresh = tokenStore.refresh;
  if (!refresh) return null;
  try {
    const { data } = await axios.post(`${baseURL}/auth/refresh/`, { refresh });
    tokenStore.setAccess(data.access);
    if (data.refresh) tokenStore.setRefresh(data.refresh);
    return data.access;
  } catch {
    tokenStore.clear();
    return null;
  }
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retried?: boolean };
    const status = error.response?.status;
    if (status === 401 && !original._retried && !(original.url?.includes('/auth/'))) {
      original._retried = true;
      refreshing ??= refreshAccess().finally(() => { refreshing = null; });
      const newAccess = await refreshing;
      if (newAccess) {
        original.headers = { ...original.headers, Authorization: `Bearer ${newAccess}` };
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Extracts a user‑friendly error message from a DRF / Axios error.
 * Returns a Persian string when possible, otherwise the raw message.
 */
export function getApiErrorMessage(error: any): string {
  if (!error) return '';
  // Axios error with response
  const resp = (error as any).response;
  if (resp && resp.data) {
    const data = resp.data;
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    // field errors: {field: ["msg"]}
    const firstKey = Object.keys(data)[0];
    const firstVal = (data as any)[firstKey];
    if (Array.isArray(firstVal) && firstVal.length) return firstVal[0];
    if (firstVal && typeof firstVal === 'string') return firstVal;
  }
  // fallback
  return error.message || String(error);
}
