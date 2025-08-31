export interface User {
  id?: number;
  email: string;
  name: string;
  tipo: 'cliente' | 'profissional';
  cpf?: string;
  crm?: string;
  especialidade?: string;
  cell?: string;
  address?: string;
  birthDate?: string;
  admin?: boolean;
  cnec?: number;
}

export interface LoginRequest {
  email: string;
  senha: string;
  userType?: 'cliente' | 'profissional';
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
