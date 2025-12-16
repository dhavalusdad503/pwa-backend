export interface LoginUserResponse {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  roleId: string | null;
  role: {
    id: string;
    name: string;
    slug: string;
  } | null;
  orgId?: string;
}

export interface LoginResponse {
  user: LoginUserResponse | null;
  token: string;
  refreshToken: string;
}
