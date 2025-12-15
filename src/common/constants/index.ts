export enum Roles {
  CAREGIVER = 'CAREGIVER',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN',
}

export const UserRoleSlugs: Record<Roles, string> = {
  [Roles.SUPERVISOR]: 'SUPERVISOR',
  [Roles.ADMIN]: 'ADMIN',
  [Roles.CAREGIVER]: 'CAREGIVER',
};

export const DEFAULT_ORGANIZATION_NAME = 'Default Organization';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  TWITTER = 'twitter',
}

export const TEMPLATE_NAME = {
  FORGOT_PASSWORD: 'forgotPassword',
};

export const LOGGER_CONTEXT = 'App';
export const RESET_PASS_TOKEN_EXPIRY_MINUTES = 10;
