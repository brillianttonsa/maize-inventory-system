// ---------- Auth ----------

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

export interface AuthPanelProps {
  mode: AuthMode;
  notice?: string;
  resetToken?: string;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}

export interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}