export interface User {
  _id: string;
  googleId: string;
  email: string;
  username?: string;
  profilePhoto?: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  receiverId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiError {
  message: string;
}