export interface User {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  birthday?: string;
  country?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  reference: string;
  amount: string | number; // Can be either string or number from backend
  currency: string;
  message?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  message: string;
  userProcessed: boolean;
  transactionsProcessed: number;
  avatarProcessed: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
