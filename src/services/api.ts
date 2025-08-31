import axios from 'axios';
import { User, Transaction, UploadResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (user: Partial<User>) => api.post<User>('/users', user),
  update: (id: string, user: Partial<User>) => api.put<User>(`/users/${id}`, user),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Transactions API
export const transactionsApi = {
  getAll: () => api.get<Transaction[]>('/transactions'),
  getById: (id: string) => api.get<Transaction>(`/transactions/${id}`),
  create: (transaction: Partial<Transaction>) => api.post<Transaction>('/transactions', transaction),
  update: (id: string, transaction: Partial<Transaction>) => api.put<Transaction>(`/transactions/${id}`, transaction),
  delete: (id: string) => api.delete(`/transactions/${id}`),
  getByUserId: (userId: string) => api.get<Transaction[]>(`/transactions/user/${userId}`),
};

// Upload API
export const uploadApi = {
  uploadZip: (file: File) => {
    const formData = new FormData();
    formData.append('zipFile', file);
    return api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
