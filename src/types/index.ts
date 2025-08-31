export interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  Transactions?: Transaction[];
}

export interface Transaction {
  id: number;
  transactionId: string;
  userId: string;
  amount: number;
  type: string;
  description?: string;
  status: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  User?: User;
}

export interface UploadResponse {
  message: string;
  usersProcessed: number;
  transactionsProcessed: number;
  avatarProcessed: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
