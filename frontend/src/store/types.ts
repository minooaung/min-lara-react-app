export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  [key: string]: any; // For any additional user properties
}

export interface AuthState {
  user: User | null;
}

export interface NotificationState {
  notificationMessage: string | null;
}

export interface RootState {
  auth: AuthState;
  notification: NotificationState;
} 