export interface LoginResponse {
  accessToken: string;
  user: {
    email: string;
    role: string;
    id: number;
  };
}