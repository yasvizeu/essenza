export interface User {
  id?: number;
  email: string;
  nome: string;
  tipo: 'cliente' | 'profissional';
  cpf?: string;
  crm?: string;
  especialidade?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
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
