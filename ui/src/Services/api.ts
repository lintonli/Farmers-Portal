import axios from 'axios';
import type { AuthResponse, FarmersListResponse, FarmerStatusResponse, LoginData, RegisterData, RegisterResponse, UpdateStatusData } from "../Types";

const api = axios.create({
  baseURL: 'http://localhost:4000/api/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.token = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const saveToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const getUserFromToken = (): any => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const registerFarmer = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await api.post('/register', data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post('/login', data);
  saveToken(response.data.token);
  return response.data;
};

export const logoutUser = (): void => {
  removeToken();
};

export const getAllFarmers = async (): Promise<FarmersListResponse> => {
  const response = await api.get('/farmers');
  return response.data;
};

export const getFarmerStatus = async (farmerId: string): Promise<FarmerStatusResponse> => {
  const response = await api.get(`/farmers/${farmerId}/status`);
  return response.data;
};

export const updateCertificationStatus = async (
  userId: string,
  data: UpdateStatusData
): Promise<any> => {
  const response = await api.patch(`/farmers/${userId}/status`, data);
  return response.data;
};
