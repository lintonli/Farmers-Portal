export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: 'farmer' | 'admin';
  createdAt: string;
  farmer?: Farmer;
}

export interface Farmer {
  id: number;
  userId: string;
  farmSize: number;
  cropType: string;
  certificationStatus: 'pending' | 'certified' | 'declined';
  appliedAt: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  farmSize: number;
  cropType: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface RegisterResponse {
  message: string;
  newUser: User;
}

export interface FarmerStatusResponse {
  message: string;
  farmer: {
    id: string;
    name: string;
    email: string;
    farmSize: number;
    cropType: string;
    certificationStatus: 'pending' | 'certified' | 'declined';
    appliedAt: string;
  };
}

export interface FarmersListResponse {
  message: string;
  users: User[];
}

export interface UpdateStatusData {
  status: 'pending' | 'certified' | 'declined';
}

export interface ApiError {
  message: string;
  error?: string;
}
