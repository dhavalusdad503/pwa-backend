import { Roles } from "@enums";

export const UserRoleSlugs: Record<Roles, string> = {
  [Roles.SUPERVISOR]: "SUPERVISOR",
  [Roles.ADMIN]: "ADMIN",
  [Roles.CAREGIVER]: "CAREGIVER",
};

export const TEMPLATE_NAME = {
  FORGOT_PASSWORD: "forgotPassword",
};

export const UPLOAD_DIRS = {
  CAREGIVER: '/uploads/users/caregiver',
  SUPERVISOR: '/uploads/users/supervisor',
  ADMIN: '/uploads/users/admin'
};