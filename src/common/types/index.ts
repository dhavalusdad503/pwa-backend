export type IDbOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
};

export type IMailOptions = {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  from?: string;
};

export type IJwtOptions = {
  jwtSecret: string;
  jwtExpiresIn: string;
};

export type IConfigStoreOptions = {
  port: number;
  database: IDbOptions;
  jwt: IJwtOptions;
  jwtSecret: string;
  jwtExpiresIn: string;
  secretKey: string;
  frontendUrl: string;
  mail: IMailOptions;
  logs_dir: string;
};

export interface AuthTokenPayload {
  id?: string;
  email?: string;
  role?: string;
  role_id?: string;
  org_id?: string;
}

export interface CommonPaginationOptionType {
  page?: number;
  limit?: number;
  search?: string;
  sortColumn?: string;
  sortOrder?: string;
  searchableFields?: string[];
}

export interface CommonPaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore?: boolean;
}
