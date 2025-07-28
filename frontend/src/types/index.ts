// User related types
export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  formatted_created_at?: string;
  formatted_updated_at?: string;
  organisations?: Organisation[];
}

// Organisation related types
export interface Organisation {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  formatted_created_at?: string;
  formatted_updated_at?: string;
  users?: User[];
  users_count?: number;
}

export interface OrganisationData {
  name: string;
  user_ids: number[];
}

export interface UpdateOrganisationData {
  id: number;
  name: string;
  user_ids: number[];
}

// Common response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  per_page: number;
  total: number;
  links: PaginationLink[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Auth related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  name: string;
  password_confirmation: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

// Dashboard related types
export interface DashboardStats {
  total_users: number;
  total_organisations: number;
  recent_users: User[];
  recent_organisations: Organisation[];
  user_roles_distribution: {
    [key in UserRole]: number;
  };
  organisation_growth: {
    date: string;
    count: number;
  }[];
} 