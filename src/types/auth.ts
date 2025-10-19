import type { User } from './user';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  full_name: string;
}
