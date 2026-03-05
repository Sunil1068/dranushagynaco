const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions {
  method?: string;
  body?: any;
  token?: string;
}

async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Something went wrong');
  }

  return res.json();
}

// Auth
export const sendOTP = (phone: string) =>
  apiRequest('/auth/send-otp', { method: 'POST', body: { phone } });

export const verifyOTP = (phone: string, otp: string, name?: string) =>
  apiRequest('/auth/verify-otp', { method: 'POST', body: { phone, otp, name } });

export const doctorLogin = (phone: string, password: string) =>
  apiRequest('/auth/doctor-login', { method: 'POST', body: { phone, password } });

// Patient
export const getProfile = (token: string) =>
  apiRequest('/patient/me', { token });

export const submitFeedback = (token: string, data: any) =>
  apiRequest('/patient/feedback', { method: 'POST', body: data, token });

export const getMyFeedback = (token: string) =>
  apiRequest('/patient/feedback', { token });

// Doctor
export const getDashboardMetrics = (token: string) =>
  apiRequest('/doctor/metrics', { token });

export const getAllFeedback = (token: string, params?: Record<string, string>) => {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiRequest(`/doctor/feedback${query}`, { token });
};

export const getLowSatisfaction = (token: string) =>
  apiRequest('/doctor/alerts/low-satisfaction', { token });

export const getComplications = (token: string) =>
  apiRequest('/doctor/alerts/complications', { token });

export const getAllPatients = (token: string) =>
  apiRequest('/doctor/patients', { token });

// Public
export const getPublicFeedback = () =>
  apiRequest('/patient/feedback/public');
