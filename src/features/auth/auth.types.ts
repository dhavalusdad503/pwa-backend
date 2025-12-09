export interface AuthTokenPayload {
  id: string;
  email: string;
  role?: string;
  role_id: string;
  org_id?: string[];
}
