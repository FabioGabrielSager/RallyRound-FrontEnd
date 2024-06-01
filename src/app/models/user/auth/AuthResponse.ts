export interface AuthResponse {
  token: string;
  username: string;
  notificationTrayId: string;
  userRoles: string[];
  privileges: string[];
}
