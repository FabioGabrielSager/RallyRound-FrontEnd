export interface AuthResponse {
  token: string;
  username: string;
  userRoles: string[];
  privileges: string[];
}
